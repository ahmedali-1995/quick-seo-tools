import React from 'react';
import TextField from '../UI/TextField';
import { Button } from '../ui/button';

interface ProductTabProps {
  productTitle: string;
  setProductTitle: (title: string) => void;
  productName: string;
  setProductName: (name: string) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  shopButtonText: string;
  setShopButtonText: (text: string) => void;
  shopUrl: string;
  setShopUrl: (url: string) => void;
  pros: string[];
  setPros: (pros: string[]) => void;
  cons: string[];
  setCons: (cons: string[]) => void;
  specs: { label: string; value: string; }[];
  setSpecs: (specs: { label: string; value: string; }[]) => void;
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
  const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpec = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  return (
    <div className="space-y-4">
      <TextField
        label="Product Title"
        value={productTitle}
        onChange={(e) => setProductTitle(e.target.value)}
        placeholder="BEST MEN'S MULTIVITAMIN FOR IMMUNE SUPPORT"
      />
      <TextField
        label="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Theralogix Solo Vitamin & Mineral Supplement"
      />
      <TextField
        label="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="/api/placeholder/150/300"
      />
      <TextField
        label="Shop Button Text"
        value={shopButtonText}
        onChange={(e) => setShopButtonText(e.target.value)}
        placeholder="SHOP AT AMAZON"
      />
      <TextField
        label="Shop URL"
        value={shopUrl}
        onChange={(e) => setShopUrl(e.target.value)}
        placeholder="https://www.amazon.com"
      />

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Pros</label>
        {pros.map((pro, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <TextField
              value={pro}
              onChange={(e) => {
                const newPros = [...pros];
                newPros[index] = e.target.value;
                setPros(newPros);
              }}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newPros = [...pros];
                newPros.splice(index, 1);
                setPros(newPros);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={() => setPros([...pros, ''])}>Add Pro</Button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Cons</label>
        {cons.map((con, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <TextField
              value={con}
              onChange={(e) => {
                const newCons = [...cons];
                newCons[index] = e.target.value;
                setCons(newCons);
              }}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newCons = [...cons];
                newCons.splice(index, 1);
                setCons(newCons);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={() => setCons([...cons, ''])}>Add Con</Button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Specs</label>
        {specs.map((spec, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <TextField
              label="Label"
              value={spec.label}
              onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
              className="flex-1"
            />
            <TextField
              label="Value"
              value={spec.value}
              onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeSpec(index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </Button>
          </div>
        ))}
        <Button variant="secondary" onClick={addSpec}>Add Spec</Button>
      </div>
    </div>
  );
};

export default ProductTab;
