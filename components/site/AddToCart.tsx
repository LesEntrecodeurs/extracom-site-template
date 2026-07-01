'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useAddToCart } from '@extracom/site-kit/react';
import { Button } from '@/components/ui/button';

export function AddToCart({
  reference,
  disabled
}: {
  reference: string;
  disabled?: boolean;
}) {
  const { addItem, isLoading } = useAddToCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      type="button"
      disabled={disabled || isLoading}
      className="w-full"
      onClick={async () => {
        try {
          await addItem({ reference, quantity: 1 });
          setAdded(true);
          toast.success('Ajouté au panier');
          setTimeout(() => setAdded(false), 1500);
        } catch {
          toast.error("Impossible d'ajouter au panier");
        }
      }}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : added ? (
        <Check className="size-4" />
      ) : (
        <ShoppingCart className="size-4" />
      )}
      {isLoading ? '…' : added ? 'Ajouté' : 'Ajouter au panier'}
    </Button>
  );
}
