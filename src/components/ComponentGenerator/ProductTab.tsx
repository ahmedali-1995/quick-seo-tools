
import React from 'react';
import TextField from '../UI/TextField';

interface ProductTabProps {
  productTitle: string;
  setProductTitle: (value: string) => void;
  productName: string;
  setProductName: (value: string) => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
  shopButtonText: string;
  setShopButtonText: (value: string) => void;
  shopUrl: string;
  setShopUrl: (value: string) => void;
  pros: string[];
  setPros: (pros: string[]) => void;
  cons: string[];
  setCons: (cons: string[]) => void;
  specs: Array<{ label: string; value: string }>;
  setSpecs: (specs: Array<{ label: string; value: string }>) => void;
}

const ProductTab: React.FC<ProductTabProps> = ({
  productTitle,
  setProductTitle,
  productName,
  setProductName,
  imageUrl,
  setImageUrl,
  shopButtonText,
  setShopButtonText,
  shopUrl,
  setShopUrl,
  pros,
  setPros,
  cons,
  setCons,
  specs,
  setSpecs,
}) => {
  const handleAddPro = () => {
    setPros([...pros, '']);
  };

  const handleUpdatePro = (index: number, value: string) => {
    const newPros = [...pros];
    newPros[index] = value;
    setPros(newPros);
  };

  const handleRemovePro = (index: number) => {
    const newPros = [...pros];
    newPros.splice(index, 1);
    setPros(newPros);
  };

  const handleAddCon = () => {
    setCons([...cons, '']);
  };

  const handleUpdateCon = (index: number, value: string) => {
    const newCons = [...cons];
    newCons[index] = value;
    setCons(newCons);
  };

  const handleRemoveCon = (index: number) => {
    const newCons = [...cons];
    newCons.splice(index, 1);
    setCons(newCons);
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const handleUpdateSpec = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecs(newSpecs);
  };

  const handleRemoveSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-6 rounded-lg glass-panel space-y-6">
        <h3 className="text-lg font-medium text-primary">Product Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Title"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
          />
          <TextField
            label="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <TextField
            label="Product Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <TextField
            label="Shop Button Text"
            value={shopButtonText}
            onChange={(e) => setShopButtonText(e.target.value)}
          />
          <TextField
            label="Shop URL"
            value={shopUrl}
            onChange={(e) => setShopUrl(e.target.value)}
            placeholder="https://www.amazon.com/product-page"
            className="md:col-span-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg glass-panel">
          <h3 className="text-lg font-medium text-primary mb-4">Pros</h3>
          <div className="space-y-3">
            {pros.map((pro, index) => (
              <div key={`pro-${index}`} className="flex items-center gap-2">
                <TextField
                  value={pro}
                  onChange={(e) => handleUpdatePro(index, e.target.value)}
                  className="flex-grow"
                />
                <button
                  onClick={() => handleRemovePro(index)}
                  className="btn-destructive py-1 px-2"
                  aria-label="Remove pro"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
            <button onClick={handleAddPro} className="btn-primary w-full mt-2">
              Add Pro
            </button>
          </div>
        </div>

        <div className="p-6 rounded-lg glass-panel">
          <h3 className="text-lg font-medium text-primary mb-4">Cons</h3>
          <div className="space-y-3">
            {cons.map((con, index) => (
              <div key={`con-${index}`} className="flex items-center gap-2">
                <TextField
                  value={con}
                  onChange={(e) => handleUpdateCon(index, e.target.value)}
                  className="flex-grow"
                />
                <button
                  onClick={() => handleRemoveCon(index)}
                  className="btn-destructive py-1 px-2"
                  aria-label="Remove con"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
            <button onClick={handleAddCon} className="btn-primary w-full mt-2">
              Add Con
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg glass-panel">
        <h3 className="text-lg font-medium text-primary mb-4">Specifications</h3>
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={`spec-${index}`} className="flex items-center gap-2">
              <TextField
                value={spec.label}
                onChange={(e) => handleUpdateSpec(index, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1"
              />
              <TextField
                value={spec.value}
                onChange={(e) => handleUpdateSpec(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1"
              />
              <button
                onClick={() => handleRemoveSpec(index)}
                className="btn-destructive py-1 px-2"
                aria-label="Remove specification"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ))}
          <button onClick={handleAddSpec} className="btn-primary w-full mt-2">
            Add Specification
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTab;
