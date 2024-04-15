import { useState } from 'react';
import './App.css';


/**
 * Overall approach in writing React:
 * 1. Finish a static version in OOP style
 * 2. Decide what are states and what are props 
 * 3. Decide where should states be put inside, and add more parameters
 * 4. Define dataFlow functions/attributes (e.g. onChange=onSearchTextChange)
 */

/**
 * Website Structure:
 * FilterableProductRow
 * - SearchBar
 * - ProductTable
 *    - ProductCategoryRow
 *    - ProductRow
 */

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]

function SearchBar({searchText, isInStockOnly, onSearchTextChange, onInStockOnlyChange}) {
  return (
    <form id="form"> 
      <input type="search" id="query" value={searchText} placeholder="Search..." 
        onChange={(e) => onSearchTextChange(e.target.value)}
      />
      <br/>
      <label>
        <input type="checkbox" checked={isInStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />
        Only show products in stock
      </label>
    </form>
  )
}

function ProductTable({products, searchText, isInStockOnly}) {
  let rows = []
  let prevCategory = null;
  for (const product of products) {
    if (
      product.name.toLowerCase().indexOf(
        searchText.toLowerCase()
      ) === -1
    ) {
      continue;
    }
    if (!product.stocked && isInStockOnly) {
      continue;
    }
    if (product.category !== prevCategory) {
      rows.push(
        <ProductCategoryRow key={product.category} category={product.category}/>
      );
      prevCategory = product.category;
    }
    rows.push(
      <ProductRow key={product.name} product={product} />
    );
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function ProductCategoryRow({category}) {
  return (
    <tr>
    <th colSpan="2">{category}</th>
  </tr>
  )
}

function ProductRow({product}) {
  const name = (product.stocked) ? product.name : <span style={{color: 'red'}}>{product.name}</span>
  return (
    <tr>
    <td>{name}</td>
    <td>{product.price}</td>
  </tr>
  )
}

function FilterableProductTable({products}) {
  const [searchText, setSearchText] = useState('');
  const [isInStockOnly, setIsInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar 
        searchText={searchText} 
        isInStockOnly={isInStockOnly} 
        onSearchTextChange={setSearchText} 
        onInStockOnlyChange={setIsInStockOnly}
      />
      <ProductTable 
        products={products} 
        searchText={searchText} 
        isInStockOnly={isInStockOnly}
      />
    </div>
  );
}

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
