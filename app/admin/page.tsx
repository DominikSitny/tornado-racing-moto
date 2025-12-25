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
} from 'lucide-react';
import Image from 'next/image';
import { Category, Model, Part } from '@/lib/types';

type ViewMode = 'categories' | 'models' | 'parts';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

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
    brand: '',
    designation: '',
    description: '',
    image: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
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
      const response = await fetch('/api/catalog');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Load error:', error);
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

  const generateId = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const apiCall = async (action: string, data: Record<string, unknown>) => {
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
        return true;
      } else {
        setSaveStatus('error');
        return false;
      }
    } catch {
      setSaveStatus('error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('password', password);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const { path } = await response.json();
        setFormData({ ...formData, image: path });
      } else {
        alert('Fehler beim Hochladen');
      }
    } catch {
      alert('Fehler beim Hochladen');
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setFormData({ id: '', name: '', brand: '', designation: '', description: '', image: '' });
    onOpen();
  };

  const openEditModal = (item: Category | Model | Part) => {
    setModalMode('edit');
    setEditingItem(item);
    if (viewMode === 'categories') {
      const cat = item as Category;
      setFormData({ id: cat.id, name: cat.name, brand: '', designation: '', description: cat.description, image: '' });
    } else if (viewMode === 'models') {
      const model = item as Model;
      setFormData({ id: model.id, name: '', brand: model.brand, designation: model.designation, description: model.description, image: '' });
    } else {
      const part = item as Part;
      setFormData({ id: part.id, name: part.name, brand: '', designation: '', description: part.description, image: part.image });
    }
    onOpen();
  };

  const saveItem = async () => {
    if (viewMode === 'categories') {
      if (modalMode === 'add') {
        await apiCall('createCategory', {
          id: generateId(formData.name),
          name: formData.name,
          description: formData.description,
        });
      } else {
        await apiCall('updateCategory', {
          id: editingItem?.id,
          name: formData.name,
          description: formData.description,
        });
      }
    } else if (viewMode === 'models' && selectedCategory) {
      if (modalMode === 'add') {
        await apiCall('createModel', {
          id: generateId(`${formData.brand}-${formData.designation}`),
          category_id: selectedCategory.id,
          brand: formData.brand,
          designation: formData.designation,
          description: formData.description,
        });
      } else {
        await apiCall('updateModel', {
          id: editingItem?.id,
          brand: formData.brand,
          designation: formData.designation,
          description: formData.description,
        });
      }
    } else if (viewMode === 'parts' && selectedModel) {
      if (modalMode === 'add') {
        await apiCall('createPart', {
          id: generateId(formData.name),
          model_id: selectedModel.id,
          name: formData.name,
          description: formData.description,
          image: formData.image || '',
        });
      } else {
        await apiCall('updatePart', {
          id: editingItem?.id,
          name: formData.name,
          description: formData.description,
          image: formData.image,
        });
      }
    }
    onClose();
  };

  const deleteItem = async (item: Category | Model | Part) => {
    if (!confirm('Wirklich löschen?')) return;

    if (viewMode === 'categories') {
      await apiCall('deleteCategory', { id: item.id });
    } else if (viewMode === 'models') {
      await apiCall('deleteModel', { id: item.id });
    } else {
      await apiCall('deletePart', { id: item.id });
    }
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
              <h1 className="text-2xl font-bold text-secondary">Katalog-Verwaltung</h1>
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
              {saveStatus === 'error' && (
                <Chip color="danger" variant="flat" size="sm">
                  Fehler
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
                  <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {(item as Part).image ? (
                      <Image src={(item as Part).image} alt={(item as Part).name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>
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

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>{modalMode === 'add' ? 'Hinzufügen' : 'Bearbeiten'}</ModalHeader>
          <ModalBody>
            {viewMode === 'categories' && (
              <>
                <Input label="Name" placeholder="z.B. Sport, Touring, Enduro" value={formData.name} onValueChange={(v) => setFormData({ ...formData, name: v })} />
                <Textarea label="Beschreibung" placeholder="Beschreibung der Kategorie..." value={formData.description} onValueChange={(v) => setFormData({ ...formData, description: v })} />
              </>
            )}
            {viewMode === 'models' && (
              <>
                <Input label="Marke" placeholder="z.B. Yamaha, Honda, Kawasaki" value={formData.brand} onValueChange={(v) => setFormData({ ...formData, brand: v })} />
                <Input label="Modellbezeichnung" placeholder="z.B. R6, CBR600RR, Ninja H2" value={formData.designation} onValueChange={(v) => setFormData({ ...formData, designation: v })} />
                <Textarea label="Beschreibung" placeholder="Beschreibung des Modells..." value={formData.description} onValueChange={(v) => setFormData({ ...formData, description: v })} />
              </>
            )}
            {viewMode === 'parts' && (
              <>
                <Input label="Name" placeholder="z.B. Bremsanlage, Auspuff, Verkleidung" value={formData.name} onValueChange={(v) => setFormData({ ...formData, name: v })} />
                <Textarea label="Beschreibung" placeholder="Beschreibung des Teils..." value={formData.description} onValueChange={(v) => setFormData({ ...formData, description: v })} />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Bild</label>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Button variant="bordered" startContent={uploadingImage ? <Spinner size="sm" /> : <Upload size={18} />} onClick={() => fileInputRef.current?.click()} isDisabled={uploadingImage} fullWidth>
                    {uploadingImage ? 'Hochladen...' : 'Bild hochladen'}
                  </Button>
                  {formData.image && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 mt-2">
                      <Image src={formData.image} alt="Vorschau" fill className="object-cover" />
                      <Button isIconOnly size="sm" color="danger" variant="solid" className="absolute top-2 right-2" onClick={() => setFormData({ ...formData, image: '' })}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                  {!formData.image && (
                    <div className="w-full h-40 rounded-lg bg-gray-100 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <ImageIcon size={32} className="mx-auto mb-2" />
                        <p className="text-sm">Kein Bild ausgewählt</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onClick={onClose}>Abbrechen</Button>
            <Button color="primary" startContent={<Save size={18} />} onClick={saveItem} isLoading={isSaving}>Speichern</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
