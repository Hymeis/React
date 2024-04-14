import logo from './logo.svg';
import './App.css';

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


function SearchBar() {
  return (
    <form id="form"> 
      <input type="search" id="query" name="q" placeholder="Search..." />
      <br/>
      <label>
        <input type="checkbox" />
        Only show products in stock
      </label>
    </form>
  )
}


function ProductTable({products}) {
  let rows = []
  let prevCategory = null;
  /** Write an algorithm (write a loop) for the rows */
  for (const product of products) {
    /**  Generate a new category if needed */
    if (product.category !== prevCategory) {
      rows.push(
        <ProductCategoryRow category={product.category}/>
      );
      prevCategory = product.category;
    }
    /** Generate the products line by line */
    rows.push(
      <ProductRow product={product} />
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
    <th >
      {category}
    </th>
  </tr>
  )

}


function ProductRow({product}) {
  const name = (product.stocked) ? product.name : <span style={{color: 'red'}}>{product.name}</span>
  return (
    <tr>
    <td >
      {name}
    </td>
    <td >
      {product.price}
    </td>
  </tr>
  )
}


function FilterableProductTable({products}) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products}/>
    </div>
  );
}

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
