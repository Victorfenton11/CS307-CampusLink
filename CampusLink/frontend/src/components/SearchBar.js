import React, { useState } from 'react'
import './styles/SearchBar.css'


export default function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState('');

  function search(event) {
    event.preventDefault();
    if (searchQuery === '') return;

    props.handleSearch(searchQuery);

    setSearchQuery('');
  }

  return (
    <form action='' onSubmit={search} className='searchbar'>
        <input type="text" value={searchQuery} placeholder={props.placeholder} name="search" onChange={(e) => setSearchQuery(e.target.value)} />
        <button type="submit"><ion-icon name="search-outline"></ion-icon></button>
    </form>
  )
}
