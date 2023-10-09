import React from 'react'
import './styles/SearchBar.css'

export default function SearchBar() {
  return (
    <form action="" className='searchbar'>
        <input type="text" placeholder="Lookup a class location or campus landmark" name="search" />
        <button type="submit"><ion-icon name="search-outline"></ion-icon></button>
    </form>
  )
}
