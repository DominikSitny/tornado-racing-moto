'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Spinner,
  Tabs,
  Tab,
} from '@nextui-org/react';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  FolderOpen,
  Bike,
  Wrench,
  Save,
  Lock,
  Upload,
  Image as ImageIcon,
  LogOut,
  RefreshCw,
  Globe,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import PartImage from '@/components/PartImage';
import { prepareImage, UnsupportedImageError, MIN_RECOMMENDED_EDGE } from '@/lib/prepare-image';
import { Category, Model, Part } from '@/lib/types';

type ViewMode = 'categories' | 'models' | 'parts';
type FormField = 'name' | 'brand' | 'designation';

/** A problem to show to the admin: what went wrong, plus optional technical details. */
interface Problem {
  title: string;
  message: string;
  details?: string;
}

type ApiResult = { ok: true } | { ok: false; message: string; field?: FormField; details?: string };

const ENTITY: Record<ViewMode, { one: string; article: string }> = {
  categories: { one: 'Kategorie', article: 'die' },
  models: { one: 'Modell', article: 'das' },
  parts: { one: 'Teil', article: 'das' },
};

const sameText = (a: string, b: string) => a.trim().toLocaleLowerCase('de') === b.trim().toLocaleLowerCase('de');

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<Category | Model | Part | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    name_en: '',
    name_pl: '',
    brand: '',
    designation: '',
    description: '',
    description_en: '',
    description_pl: '',
    image: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageWarning, setImageWarning] = useState('');

  // Errors inside the edit form (form stays open so nothing typed is lost)
  const [formError, setFormError] = useState<Problem | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormField, string>>>({});
  const [langTab, setLangTab] = useState<'de' | 'en' | 'pl'>('de');

  // Errors outside the form (loading, deleting) and the delete confirmation
  const [problem, setProblem] = useState<Problem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | Model | Part | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin-password');
    if (savedPassword) {
      setPassword(savedPassword);
      verifyAndLoad(savedPassword);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadCatalog = async () => {
    try {
      // Load RAW data with all language fields
      const response = await fetch('/api/catalog?raw=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        const data = await response.json().catch(() => ({}));
        setProblem({
          title: 'Katalog konnte nicht geladen werden',
          message: data.error || 'Der Server hat mit einem Fehler geantwortet. Bitte versuche es mit „Aktualisieren“ erneut.',
          details: `HTTP ${response.status}`,
        });
      }
    } catch (error) {
      setProblem({
        title: 'Keine Verbindung',
        message: 'Der Katalog konnte nicht geladen werden, weil keine Verbindung zum Server besteht. Prüfe deine Internetverbindung und klicke auf „Aktualisieren“.',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const verifyAndLoad = async (pwd: string) => {
    try {
      const response = await fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', password: pwd }),
      });

      if (response.status === 401) {
        setLoginError('Falsches Passwort');
        setIsLoading(false);
        return;
      }

      await loadCatalog();
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-password', pwd);
    } catch {
      setLoginError('Verbindungsfehler');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setLoginError('');
    setIsLoading(true);
    verifyAndLoad(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-password');
    setIsAuthenticated(false);
    setPassword('');
  };

  const apiCall = async (action: string, data: Record<string, unknown>): Promise<ApiResult> => {
    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const response = await fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, password, data }),
      });

      if (response.ok) {
        setSaveStatus('saved');
        await loadCatalog();
        setTimeout(() => setSaveStatus('idle'), 2000);
        return { ok: true };
      }

      setSaveStatus('idle');
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) {
        return {
          ok: false,
          message: 'Das Admin-Passwort ist nicht mehr gültig (vielleicht wurde es geändert). Bitte melde dich ab und neu an.',
        };
      }
      return {
        ok: false,
        message: body.error || `Der Server hat mit einem Fehler geantwortet (HTTP ${response.status}).`,
        field: body.field,
        details: body.details,
      };
    } catch (error) {
      setSaveStatus('idle');
      return {
        ok: false,
        message: 'Keine Verbindung zum Server. Prüfe deine Internetverbindung und versuche es erneut.',
        details: error instanceof Error ? error.message : String(error),
      };
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so selecting the same file again triggers onChange
    e.target.value = '';
    if (!file) return;

    setUploadingImage(true);
    setImageWarning('');
    setFormError(null);
    try {
      let prepared;
      try {
        prepared = await prepareImage(file);
      } catch (err) {
        if (err instanceof UnsupportedImageError) {
          setFormError({
            title: 'Bildformat wird nicht unterstützt',
            message: 'Dein Browser kann dieses Bild nicht lesen (typisch für HEIC-Fotos vom iPhone). Bitte speichere es als JPG oder PNG und lade es erneut hoch.',
            details: file.type || file.name,
          });
          return;
        }
        throw err;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', prepared.file);
      formDataUpload.append('password', password);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const { path } = await response.json();
        setFormData((prev) => ({ ...prev, image: path }));
        if (prepared.originalLongEdge < MIN_RECOMMENDED_EDGE) {
          setImageWarning(
            `Das Bild ist nur ${prepared.originalLongEdge} px groß und wird im Shop unscharf aussehen. Empfohlen sind mindestens ${MIN_RECOMMENDED_EDGE} px – am besten das Originalfoto verwenden, kein Vorschaubild.`
          );
        }
      } else {
        const data = await response.json().catch(() => ({}));
        setFormError({
          title: 'Bild konnte nicht hochgeladen werden',
          message:
            response.status === 401
              ? 'Das Admin-Passwort ist nicht mehr gültig. Bitte melde dich ab und neu an.'
              : data.error || `Der Server hat mit einem Fehler geantwortet (HTTP ${response.status}).`,
        });
      }
    } catch (error) {
      setFormError({
        title: 'Bild konnte nicht hochgeladen werden',
        message: 'Keine Verbindung zum Server. Prüfe deine Internetverbindung und versuche es erneut.',
        details: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddModal = () => {
    setImageWarning('');
    setFormError(null);
    setFieldErrors({});
    setLangTab('de');
    setModalMode('add');
    setEditingItem(null);
    setFormData({
      id: '', name: '', name_en: '', name_pl: '',
      brand: '', designation: '',
      description: '', description_en: '', description_pl: '',
      image: ''
    });
    onOpen();
  };

  const openEditModal = (item: Category | Model | Part) => {
    setImageWarning('');
    setFormError(null);
    setFieldErrors({});
    setLangTab('de');
    setModalMode('edit');
    setEditingItem(item);
    if (viewMode === 'categories') {
      const cat = item as Category;
      setFormData({
        id: cat.id,
        name: cat.name,
        name_en: cat.name_en || '',
        name_pl: cat.name_pl || '',
        brand: '', designation: '',
        description: cat.description,
        description_en: cat.description_en || '',
        description_pl: cat.description_pl || '',
        image: ''
      });
    } else if (viewMode === 'models') {
      const model = item as Model;
      setFormData({
        id: model.id,
        name: '', name_en: '', name_pl: '',
        brand: model.brand,
        designation: model.designation,
        description: model.description,
        description_en: model.description_en || '',
        description_pl: model.description_pl || '',
        image: ''
      });
    } else {
      const part = item as Part;
      setFormData({
        id: part.id,
        name: part.name,
        name_en: part.name_en || '',
        name_pl: part.name_pl || '',
        brand: '', designation: '',
        description: part.description,
        description_en: part.description_en || '',
        description_pl: part.description_pl || '',
        image: part.image
      });
    }
    onOpen();
  };

  /** Checks the form before sending it, so obvious mistakes show up right at the field. */
  const validateForm = () => {
    const errors: Partial<Record<FormField, string>> = {};
    const others = getCurrentItems().filter((item) => item.id !== editingItem?.id);

    if (viewMode === 'models') {
      if (!formData.brand.trim()) errors.brand = 'Bitte gib eine Marke ein.';
      if (!formData.designation.trim()) errors.designation = 'Bitte gib eine Modellbezeichnung ein.';
      if (
        !errors.brand &&
        !errors.designation &&
        (others as Model[]).some((m) => sameText(m.brand, formData.brand) && sameText(m.designation, formData.designation))
      ) {
        errors.designation = `„${formData.brand.trim()} ${formData.designation.trim()}“ gibt es in dieser Kategorie schon.`;
      }
    } else {
      if (!formData.name.trim()) {
        errors.name = 'Bitte gib einen Namen auf Deutsch ein.';
      } else if ((others as (Category | Part)[]).some((item) => sameText(item.name, formData.name))) {
        errors.name =
          viewMode === 'parts'
            ? `Ein Teil „${formData.name.trim()}“ gibt es bei diesem Modell schon.`
            : `Eine Kategorie „${formData.name.trim()}“ gibt es schon.`;
      }
    }

    setFieldErrors(errors);
    const messages = Object.values(errors);
    if (messages.length > 0) {
      setLangTab('de');
      setFormError({
        title: messages.length === 1 ? 'Bitte prüfe deine Eingabe' : 'Bitte prüfe deine Eingaben',
        message: messages.join(' '),
      });
      return false;
    }
    return true;
  };

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key as FormField];
        return next;
      });
    }
  };

  const saveItem = async () => {
    setFormError(null);
    if (!validateForm()) return;

    const texts = {
      description: formData.description.trim(),
      description_en: formData.description_en.trim() || null,
      description_pl: formData.description_pl.trim() || null,
    };
    const names = {
      name: formData.name.trim(),
      name_en: formData.name_en.trim() || null,
      name_pl: formData.name_pl.trim() || null,
    };
    const model = { brand: formData.brand.trim(), designation: formData.designation.trim() };

    let result: ApiResult = { ok: false, message: 'Es ist nichts ausgewählt. Bitte gehe zurück und wähle eine Kategorie bzw. ein Modell.' };

    if (viewMode === 'categories') {
      result =
        modalMode === 'add'
          ? await apiCall('createCategory', { ...names, ...texts })
          : await apiCall('updateCategory', { id: editingItem?.id, ...names, ...texts });
    } else if (viewMode === 'models' && selectedCategory) {
      result =
        modalMode === 'add'
          ? await apiCall('createModel', { category_id: selectedCategory.id, ...model, ...texts })
          : await apiCall('updateModel', { id: editingItem?.id, ...model, ...texts });
    } else if (viewMode === 'parts' && selectedModel) {
      result =
        modalMode === 'add'
          ? await apiCall('createPart', { model_id: selectedModel.id, ...names, ...texts, image: formData.image || '' })
          : await apiCall('updatePart', { id: editingItem?.id, ...names, ...texts, image: formData.image });
    }

    if (result.ok) {
      onClose();
      return;
    }

    if (result.field) {
      setFieldErrors({ [result.field]: result.message });
      setLangTab('de');
    }
    setFormError({
      title: `${ENTITY[viewMode].one} konnte nicht gespeichert werden`,
      message: result.message,
      details: result.details,
    });
  };

  const deleteItem = (item: Category | Model | Part) => {
    setPendingDelete(item);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    const action = viewMode === 'categories' ? 'deleteCategory' : viewMode === 'models' ? 'deleteModel' : 'deletePart';
    const result = await apiCall(action, { id: pendingDelete.id });
    setIsDeleting(false);
    setPendingDelete(null);
    if (!result.ok) {
      setProblem({
        title: `${ENTITY[viewMode].one} konnte nicht gelöscht werden`,
        message: result.message,
        details: result.details,
      });
    }
  };

  /** Human-readable name of a list item, e.g. for the delete confirmation. */
  const itemLabel = (item: Category | Model | Part) =>
    viewMode === 'models' ? `${(item as Model).brand} ${(item as Model).designation}` : (item as Category | Part).name;

  /** What else disappears when this item is deleted. */
  const deleteConsequence = (item: Category | Model | Part) => {
    if (viewMode === 'categories') {
      const cat = item as Category;
      const parts = cat.models.reduce((sum, m) => sum + m.parts.length, 0);
      if (cat.models.length === 0) return null;
      return `Diese Kategorie enthält ${cat.models.length} ${cat.models.length === 1 ? 'Modell' : 'Modelle'} mit insgesamt ${parts} ${parts === 1 ? 'Teil' : 'Teilen'}.`;
    }
    if (viewMode === 'models') {
      const count = (item as Model).parts.length;
      if (count === 0) return null;
      return `Zu diesem Modell gehören ${count} ${count === 1 ? 'Teil' : 'Teile'}.`;
    }
    return null;
  };

  const goToModels = (category: Category) => {
    setSelectedCategory(category);
    setViewMode('models');
  };

  const goToParts = (model: Model) => {
    setSelectedModel(model);
    setViewMode('parts');
  };

  const goBack = () => {
    if (viewMode === 'parts') {
      setViewMode('models');
      setSelectedModel(null);
    } else if (viewMode === 'models') {
      setViewMode('categories');
      setSelectedCategory(null);
    }
  };

  const getCurrentItems = () => {
    if (viewMode === 'categories') return categories;
    if (viewMode === 'models' && selectedCategory) {
      const cat = categories.find(c => c.id === selectedCategory.id);
      return cat?.models || [];
    }
    if (viewMode === 'parts' && selectedCategory && selectedModel) {
      const cat = categories.find(c => c.id === selectedCategory.id);
      const model = cat?.models.find(m => m.id === selectedModel.id);
      return model?.parts || [];
    }
    return [];
  };

  const getTitle = () => {
    if (viewMode === 'categories') return 'Kategorien';
    if (viewMode === 'models') return `${selectedCategory?.name} - Modelle`;
    if (viewMode === 'parts') return `${selectedModel?.brand} ${selectedModel?.designation} - Teile`;
    return '';
  };

  const getIcon = () => {
    if (viewMode === 'categories') return <FolderOpen size={24} />;
    if (viewMode === 'models') return <Bike size={24} />;
    return <Wrench size={24} />;
  };

  // Render language tabs for form fields
  const renderLanguageTabs = () => (
    <Tabs
      aria-label="Sprachen"
      color="primary"
      variant="bordered"
      classNames={{ tabList: 'gap-2' }}
      selectedKey={langTab}
      onSelectionChange={(key) => setLangTab(key as 'de' | 'en' | 'pl')}
    >
      <Tab
        key="de"
        title={
          <span className="flex items-center gap-1">
            🇩🇪 Deutsch
            {Object.keys(fieldErrors).length > 0 && <AlertTriangle size={14} className="text-current" aria-label="Fehler" />}
          </span>
        }
      >
        <div className="space-y-4 pt-4">
          {(viewMode === 'categories' || viewMode === 'parts') && (
            <Input
              label="Name (DE)"
              placeholder="Name auf Deutsch"
              value={formData.name}
              onValueChange={(v) => updateField('name', v)}
              isRequired
              isInvalid={!!fieldErrors.name}
              errorMessage={fieldErrors.name}
            />
          )}
          {viewMode === 'models' && (
            <>
              <Input
                label="Marke"
                placeholder="z.B. Yamaha, Honda"
                value={formData.brand}
                onValueChange={(v) => updateField('brand', v)}
                isRequired
                isInvalid={!!fieldErrors.brand}
                errorMessage={fieldErrors.brand}
              />
              <Input
                label="Modellbezeichnung"
                placeholder="z.B. R6, CBR600RR"
                value={formData.designation}
                onValueChange={(v) => updateField('designation', v)}
                isRequired
                isInvalid={!!fieldErrors.designation}
                errorMessage={fieldErrors.designation}
              />
            </>
          )}
          <Textarea
            label="Beschreibung (DE)"
            placeholder="Beschreibung auf Deutsch..."
            value={formData.description}
            onValueChange={(v) => updateField('description', v)}
          />
        </div>
      </Tab>
      <Tab key="en" title={<span className="flex items-center gap-1">🇬🇧 English</span>}>
        <div className="space-y-4 pt-4">
          {(viewMode === 'categories' || viewMode === 'parts') && (
            <Input
              label="Name (EN)"
              placeholder="Name in English"
              value={formData.name_en}
              onValueChange={(v) => updateField('name_en', v)}
            />
          )}
          <Textarea
            label="Description (EN)"
            placeholder="Description in English..."
            value={formData.description_en}
            onValueChange={(v) => updateField('description_en', v)}
          />
        </div>
      </Tab>
      <Tab key="pl" title={<span className="flex items-center gap-1">🇵🇱 Polski</span>}>
        <div className="space-y-4 pt-4">
          {(viewMode === 'categories' || viewMode === 'parts') && (
            <Input
              label="Nazwa (PL)"
              placeholder="Nazwa po polsku"
              value={formData.name_pl}
              onValueChange={(v) => updateField('name_pl', v)}
            />
          )}
          <Textarea
            label="Opis (PL)"
            placeholder="Opis po polsku..."
            value={formData.description_pl}
            onValueChange={(v) => updateField('description_pl', v)}
          />
        </div>
      </Tab>
    </Tabs>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-secondary">Admin-Bereich</h1>
              <p className="text-gray-500">Tornado Racing Moto</p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-danger-50 text-danger rounded-lg text-center">
                {loginError}
              </div>
            )}

            <Input
              type="password"
              label="Passwort"
              placeholder="Passwort eingeben"
              value={password}
              onValueChange={setPassword}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              variant="bordered"
              size="lg"
            />

            <Button
              color="primary"
              variant="shadow"
              size="lg"
              fullWidth
              className="mt-4"
              onClick={handleLogin}
              isLoading={isLoading}
            >
              Anmelden
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
                Katalog-Verwaltung
                <Chip size="sm" color="primary" variant="flat" startContent={<Globe size={12} />}>
                  DE / EN / PL
                </Chip>
              </h1>
              <p className="text-gray-500 text-sm">Tornado Racing Moto</p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              {saveStatus === 'saving' && (
                <Chip color="warning" variant="flat" size="sm" startContent={<Spinner size="sm" />}>
                  Speichern...
                </Chip>
              )}
              {saveStatus === 'saved' && (
                <Chip color="success" variant="flat" size="sm">
                  Gespeichert!
                </Chip>
              )}
              <Button
                variant="flat"
                size="sm"
                startContent={<RefreshCw size={16} />}
                onClick={loadCatalog}
              >
                Aktualisieren
              </Button>
              <Button
                color="danger"
                variant="flat"
                size="sm"
                startContent={<LogOut size={16} />}
                onClick={handleLogout}
              >
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            {viewMode !== 'categories' && (
              <Button variant="flat" size="sm" startContent={<ChevronLeft size={16} />} onClick={goBack}>
                Zurück
              </Button>
            )}
            <div className="flex items-center gap-2 text-secondary">
              {getIcon()}
              <h2 className="text-xl font-semibold">{getTitle()}</h2>
            </div>
          </div>
          <Button color="primary" variant="shadow" startContent={<Plus size={18} />} onClick={openAddModal}>
            {viewMode === 'categories' && 'Kategorie hinzufügen'}
            {viewMode === 'models' && 'Modell hinzufügen'}
            {viewMode === 'parts' && 'Teil hinzufügen'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 [&>*]:min-w-0">
          {getCurrentItems().map((item) => (
            <Card key={item.id} className={`border-none shadow-md hover:shadow-lg transition-shadow w-full overflow-hidden ${viewMode === 'parts' ? 'h-[320px]' : 'h-[180px]'}`}>
              <CardBody className="p-4 flex flex-col h-full">
                {viewMode === 'parts' && (
                  <PartImage
                    key={(item as Part).image}
                    src={(item as Part).image}
                    alt={(item as Part).name}
                    sizes="400px"
                    className="w-full h-32 mb-3 rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    {viewMode === 'categories' && (
                      <h3 className="font-bold text-lg text-secondary truncate">{(item as Category).name}</h3>
                    )}
                    {viewMode === 'models' && (
                      <>
                        <Chip size="sm" color="primary" variant="flat" className="mb-1">{(item as Model).brand}</Chip>
                        <h3 className="font-bold text-lg text-secondary truncate">{(item as Model).designation}</h3>
                      </>
                    )}
                    {viewMode === 'parts' && (
                      <h3 className="font-bold text-lg text-secondary truncate">{(item as Part).name}</h3>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button isIconOnly size="sm" variant="flat" onClick={() => openEditModal(item)}>
                      <Pencil size={16} />
                    </Button>
                    <Button isIconOnly size="sm" variant="flat" color="danger" onClick={() => deleteItem(item)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 flex-grow">{item.description}</p>
                <div className="mt-auto pt-2">
                  {viewMode === 'categories' && (
                    <Button size="sm" variant="flat" color="primary" endContent={<ChevronRight size={16} />} onClick={() => goToModels(item as Category)}>
                      {(item as Category).models.length} Modelle
                    </Button>
                  )}
                  {viewMode === 'models' && (
                    <Button size="sm" variant="flat" color="primary" endContent={<ChevronRight size={16} />} onClick={() => goToParts(item as Model)}>
                      {(item as Model).parts.length} Teile
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {getCurrentItems().length === 0 && (
          <Card className="border-none shadow-md">
            <CardBody className="p-12 text-center">
              <p className="text-gray-500">Noch keine Einträge vorhanden.</p>
              <Button color="primary" variant="flat" className="mt-4" startContent={<Plus size={18} />} onClick={openAddModal}>
                Ersten Eintrag hinzufügen
              </Button>
            </CardBody>
          </Card>
        )}
      </main>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            {ENTITY[viewMode].one} {modalMode === 'add' ? 'hinzufügen' : 'bearbeiten'}
          </ModalHeader>
          <ModalBody>
            {renderLanguageTabs()}

            {viewMode === 'parts' && (
              <div className="space-y-2 mt-4 border-t pt-4">
                <label className="text-sm font-medium text-secondary">Bild</label>
                <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={handleImageUpload} className="hidden" />
                <Button variant="bordered" startContent={uploadingImage ? <Spinner size="sm" /> : <Upload size={18} />} onClick={() => fileInputRef.current?.click()} isDisabled={uploadingImage} fullWidth>
                  {uploadingImage ? 'Hochladen...' : 'Bild hochladen'}
                </Button>
                {formData.image && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 mt-2">
                    <Image src={formData.image} alt="Vorschau" fill sizes="600px" className="object-contain p-2" />
                    <Button isIconOnly size="sm" color="danger" variant="solid" className="absolute top-2 right-2" onClick={() => { setFormData({ ...formData, image: '' }); setImageWarning(''); }}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
                {imageWarning && (
                  <p role="alert" className="text-sm text-warning-700 bg-warning-50 border-l-2 border-warning px-3 py-2">
                    {imageWarning}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  JPG, PNG oder WebP, mindestens {MIN_RECOMMENDED_EDGE} px. Das Bild wird automatisch gedreht und verkleinert, aber nicht zugeschnitten.
                </p>
                {!formData.image && (
                  <div className="w-full h-40 rounded-lg bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <ImageIcon size={32} className="mx-auto mb-2" />
                      <p className="text-sm">Kein Bild ausgewählt</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          {formError && (
            <div className="px-6">
              <ProblemBox problem={formError} onDismiss={() => setFormError(null)} />
            </div>
          )}
          <ModalFooter>
            <Button variant="flat" onClick={onClose}>Abbrechen</Button>
            <Button color="primary" startContent={<Save size={18} />} onClick={saveItem} isLoading={isSaving}>Speichern</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!pendingDelete} onClose={() => !isDeleting && setPendingDelete(null)} size="md">
        <ModalContent>
          {pendingDelete && (
            <>
              <ModalHeader>{ENTITY[viewMode].one} löschen?</ModalHeader>
              <ModalBody>
                <p>
                  Möchtest du {ENTITY[viewMode].article} {ENTITY[viewMode].one} <strong>„{itemLabel(pendingDelete)}“</strong> wirklich
                  löschen? Das lässt sich nicht rückgängig machen.
                </p>
                {deleteConsequence(pendingDelete) && (
                  <p className="text-sm text-warning-700 bg-warning-50 border-l-2 border-warning px-3 py-2">
                    {deleteConsequence(pendingDelete)}
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onClick={() => setPendingDelete(null)} isDisabled={isDeleting}>
                  Abbrechen
                </Button>
                <Button color="danger" startContent={!isDeleting && <Trash2 size={16} />} onClick={confirmDelete} isLoading={isDeleting}>
                  Endgültig löschen
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Errors outside the form: loading, deleting */}
      <Modal isOpen={!!problem} onClose={() => setProblem(null)} size="md">
        <ModalContent>
          {problem && (
            <>
              <ModalHeader className="flex items-center gap-2 text-danger">
                <AlertTriangle size={20} />
                {problem.title}
              </ModalHeader>
              <ModalBody>
                <p>{problem.message}</p>
                {problem.details && <TechnicalDetails details={problem.details} />}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => setProblem(null)}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function TechnicalDetails({ details }: { details: string }) {
  return (
    <details className="text-xs text-gray-500">
      <summary className="cursor-pointer select-none">Technische Details</summary>
      <code className="block mt-1 p-2 bg-gray-100 rounded break-all whitespace-pre-wrap">{details}</code>
    </details>
  );
}

/** Prominent error box shown inside the edit form, right above the save button. */
function ProblemBox({ problem, onDismiss }: { problem: Problem; onDismiss: () => void }) {
  return (
    <div role="alert" className="flex gap-3 rounded-lg border border-danger-200 bg-danger-50 p-4 text-danger-800">
      <AlertTriangle size={20} className="shrink-0 text-danger mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{problem.title}</p>
        <p className="text-sm mt-1">{problem.message}</p>
        {problem.details && (
          <div className="mt-2">
            <TechnicalDetails details={problem.details} />
          </div>
        )}
      </div>
      <button type="button" onClick={onDismiss} className="self-start text-danger-600 hover:text-danger-800 text-sm" aria-label="Meldung schließen">
        ✕
      </button>
    </div>
  );
}
