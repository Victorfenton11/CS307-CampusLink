import React from 'react'
import '../styles/TextBox.css'

const Name =({
    onChange,
    value
  })=>
    <div className="field">
      <label htmlFor="name">
        name:
      </label>
      <input 
        id="name" 
        type="text" 
        onChange={onChange} 
        maxLength="25" 
        value={value} 
        placeholder="Alexa" 
        required/>
    </div>
  
  const Profile =({
    onSubmit,
    name,
  })=>
    <div className="card">
      <form onSubmit={onSubmit}>
        <div className="name">{name}</div>
      </form>
    </div>
             
  const Edit =({
    onSubmit,
    children,
  })=>
    <div className="card">
      <form onSubmit={onSubmit}>
          {children}
      </form>
    </div>
  
  class TextBox extends React.Component {
    state = {
      name:'',
      active: 'edit'
    }
    
    editName = e =>{
      const name = e.target.value;
      this.setState({
        name,
      });
    }

    handleSubmit= e =>{
      e.preventDefault();
      let activeP = this.state.active === 'edit' ? 'profile' : 'edit';
      this.setState({
        active: activeP,
      })
    }
    
    render() {
      const {name, 
             active} = this.state;
      return (
        <div>
          {(active === 'edit')?(
            <Edit onSubmit={this.handleSubmit}>
              <Name onChange={this.editName} value={name}/>
            </Edit>
          ):(
            <Profile 
              onSubmit={this.handleSubmit} 
              name={name} />)}
          
        </div>
      )
    }
  }

  export default TextBox;
  
