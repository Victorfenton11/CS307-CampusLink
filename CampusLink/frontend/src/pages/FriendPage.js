import React from 'react'
import './styles/FriendPage.css'
import Footer from "../components/Footer"
import DataTable from "../components/DataTable"
import MockData from "../components/MOCK_DATA.json"

export default function FriendPage() {
  return (
    <div className="page-wrapper">
        <div className="content-wrapper">
            <div className="Searchbar" >Searchbar</div>
            <div className="Friendlist" >Friendlist</div>
            <DataTable data={MockData}/>
        </div>
        
        <Footer></Footer>
    </div>
  )
}
