import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Api from '../../services/Api';
import './gitPage.scss';
import '../../common/scss/loader.scss';

export default class GitPage extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      repositories: [],
      since: 1,
      totalSize: 0,
      page: 1,
      sizePerPage: 10,
      items: [],
      isLoading: false,
      isError: false,
      error: '',
      sortOrder: 'asc',
      sortName: 'id'
    }
  }

  async componentDidMount(){
    await this.fetchData();
  }

  getGitHubRepos = async (page, size) => {
    if(page*size >= this.state.repositories.length){ // Fetch if reached to end or data is not yet available
      this.state.isLoading = true;
      this.setState({isError: false, error: ''});
      const response = await Api.getGitPublicRepos(this.state.since);
      if(!response.isError){
        this.setState({repositories: [...this.state.repositories, ...response.repos], 
          since: response.since});
          this.onSortChange(this.state.sortName, this.state.sortOrder, false);
      }else{
        this.setState({isError: response.isError, error: response.error});
      }
      this.state.isLoading = false;
    }
    if(!this.state.isError){
      return ({items: this.state.repositories.slice((page-1)*size, ((page-1)*size) + size), 
        total: this.state.repositories.length});
    }else{
      return {isError: this.state.isError, error: this.state.error};
    }
  }

  fetchData = async (page = this.state.page, sizePerPage = this.state.sizePerPage) => {
    const data = await this.getGitHubRepos(page, sizePerPage)
    if(!data.isError){
      this.setState({items: data.items, totalSize: data.total, page, sizePerPage});
    }
  }

  handlePageChange = (page, sizePerPage) => {
    this.fetchData(page, sizePerPage);
  }

  onSortChange = (sortName, sortOrder, onEvent=true) => {
    if (sortOrder === 'asc') {
      this.state.repositories.sort(function(a, b) {
        return (parseInt(a[sortName], 10) - parseInt(b[sortName], 10));
      });
    } else {
      this.state.repositories.sort(function(a, b) {
        return (parseInt(b[sortName], 10) - parseInt(a[sortName], 10));
      });
    }
    if(onEvent){
      this.setState({ sortOrder : sortOrder, sortName: sortName });
      this.fetchData();
    }
  }



  showOwnerLogin = (cell, row) => {
    return(<div id="user-login">
      <img src={row.owner.avatar_url} alt="User Avatar"     
        onError={(e)=>{e.target.onerror = null; 
        e.target.src="../../assets/images/default-avatar.png"}} />
        <a href={row.owner.html_url} target="_blank"><span>{row.owner.login}</span></a>
    </div>);
  }

  getRepositoryUrl = (cell, row) => {
    return (<a href={row.html_url} target="_blank"> {row.full_name}</a>);
  }

  getDescriptionOrTitle = (cell, row) =>{
    return row.description ? row.description : `No description for this repo.`;
  }

  render() {
    const options = {
      onPageChange: this.handlePageChange,
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
      onSortChange: this.onSortChange,
      sortOrder: 'asc'
    };

    return (
      <div id="repositories">
        { this.state.repositories.length  ? 
       <BootstrapTable 
          remote
          hover
          options={options}
          data={ this.state.items }
          fetchInfo={{dataTotalSize: this.state.repositories.length}}
          pagination>
          <TableHeaderColumn width={'10%'} dataSort= {true} dataField='id'
          sortFunc={ this.onSortChange }
          isKey={true}>Repository Id</TableHeaderColumn>
          <TableHeaderColumn dataField='data' dataFormat={this.showOwnerLogin}>Owner</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>Repository Name</TableHeaderColumn>
          <TableHeaderColumn columnTitle={this.getDescriptionOrTitle} 
            dataFormat={this.getDescriptionOrTitle} 
            dataField='description'>Description</TableHeaderColumn>
          <TableHeaderColumn dataField='url' dataFormat={this.getRepositoryUrl}>Repository Url</TableHeaderColumn>
        </BootstrapTable>
        : !this.state.isError ? <div className="loader">Loading...</div> : 
          <div id="error">
            Some error occured while fetching data. Error - {this.state.error} 
          </div>
        }
      </div>
    )
  }
}
