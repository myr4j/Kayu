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

  private codeBarresCOllections = [
    '4008400402222', // nutella
    '3302740059193', // poulet
    '3248832940522', // couscous
  ];

  constructor(private http: HttpClient) {}

  async fetchRandomProduct() {
    this.isLoading = true;
    this.error = '';
    this.produit = null;

    const randomBarCode = this.codeBarresCOllections[
      Math.floor(Math.random() * this.codeBarresCOllections.length)
    ];

    const url = `https://world.openfoodfacts.org/api/v0/product/${randomBarCode}.json`;

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
