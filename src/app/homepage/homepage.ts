import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class Homepage {
  produit: any = null;
  isLoading = false;
  error = '';

  private nutellaCodeBarre = '4008400402222';

  constructor(private http: HttpClient) {}

  async fetchProduct() {
    this.isLoading = true;
    this.error = '';
    this.produit = null;

    const url = `https://world.openfoodfacts.org/api/v0/product/${this.nutellaCodeBarre}.json`;

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (!data.product) {
          this.error = 'Produit introuvable.';
        } else {
          const p = data.product;
          this.produit = {
            name: p.product_name || 'Nom inconnu',
            brand: p.brands || 'N/A',
            nutriscore: p.nutriscore_grade?.toUpperCase() || 'N/A',
            image: p.image_front_small_url || '',
            allergens: p.allergens_from_ingredients || 'Aucun info',
            ingredients: p.ingredients_text || 'Aucun info',
            additives: p.additives_original_tags?.join(', ') || 'Aucun info'
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de l\'appel API.';
        this.isLoading = false;
      }
    });
  }
}
