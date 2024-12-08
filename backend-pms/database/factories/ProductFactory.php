<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'barcode' => 'BAR-' . $this->faker->unique()->numberBetween(1, 1000000),
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'stock' => $this->faker->numberBetween(10, 200),
            'price' => $this->faker->randomFloat(2, 5, 100), 
            'category' => $this->faker->word,
        ];
    }
}
