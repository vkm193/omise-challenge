import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Api from '../../services/Api';
import './GitPage.scss';
import '../../common/scss/loader.scss';

export default class GitPage extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      repostitories: [],
      since: 1,
      totalSize: 0,
      page: 1,
      sizePerPage: 10,
      items: [],
      isLoading: false,
      isError: false,
      error: ''
    }
  }

  getGitHubRepos = async (page, size) => {
    if(page*size >= this.state.repostitories.length){ // Fetch if reached to end or data is not yet available
      this.state.isLoading = true;
      this.setState({isError: false, error: ''});
      const response = await Api.getGitPublicRepos(this.state.since);
      if(!response.isError){
        this.setState({repostitories: [...this.state.repostitories, ...response.repos], 
          since: response.since});
      }else{
        this.setState({isError: response.isError, error: response.error});
      }
      this.state.isLoading = false;
    }
    if(!this.state.isError){
      return ({items: this.state.repostitories.slice((page-1)*size, ((page-1)*size) + size), 
        total: this.state.repostitories.length});
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

  handleSizePerPageChange = (sizePerPage) => {
    // When changing the size per page always navigating to the first page
    this.fetchData(1, sizePerPage);
  }

  handlePageChange = (page, sizePerPage) => {
    this.fetchData(page, sizePerPage);
  }

  async componentDidMount(){
    await this.fetchData();
  }

  showOwnerLogin = (cell, row) => {
    return(<div id="user-login">
      <img src={row.owner.avatar_url} alt="User Avatan"     
        onError={(e)=>{e.target.onerror = null; 
        e.target.src="../../assets/images/default-avatar.png"}} />
        <a href={row.owner.html_url} target="_blank"><span>{row.owner.login}</span></a>
    </div>);
  }

  getRepositoryUrl = (cell, row) => {
    return (<a href={row.html_url} target="_blank"> {row.full_name}</a>);
  }

  getTitle = (cell, row) => {
    return row.description;
  }

  render() {
    const options = {
      onPageChange: this.handlePageChange,
      onSizePerPageList: this.handleSizePerPageChange,
      page: this.state.page,
      sizePerPage: this.state.sizePerPage
    };

    return (
      <div id="repositories">
        { this.state.repostitories.length  ? 
       <BootstrapTable hover remote
          options={options}
          data={ this.state.items }
          fetchInfo={{dataTotalSize: this.state.repostitories.length}}
          pagination>
          <TableHeaderColumn width={'10%'} dataField='id' sortFunc={this.sortOnId} isKey={true}>Repository Id</TableHeaderColumn>
          <TableHeaderColumn dataField='data' dataFormat={this.showOwnerLogin}>Owner</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>Repository Name</TableHeaderColumn>
          <TableHeaderColumn columnTitle={this.getTitle} dataField='description'>Description</TableHeaderColumn>
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
