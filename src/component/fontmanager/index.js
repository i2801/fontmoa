import intl from 'react-intl-universal'
import React from 'react';
import './default.css';

import { Window } from '../../ui'
import { db }  from '../../util'

import FontListView from '../FontListView'
import DirectoryManager from '../DirectoryManager'
import SearchFilterLayer from '../SearchFilterLayer'
import FontToolbar from '../FontToolbar'
import SearchToolbar from '../SearchToolbar'

const { shell } = window.require('electron').remote;

class FontManager extends Window {

  constructor (props) {
    super(props);

    this.state = { 
      files : [], 
    }

    this.init();

  }

  init = () => {

    db.initFontDirectory(() => {
      this.refreshAll();
    })

  }

  refreshAll = () => {
    this.refs.dir.refresh();
    this.search();
  }


  refreshFiles = (files) => {
    this.refs.fontlistview.refreshFiles(files);
  }

  showSearchFilter = () => {
    this.refs.searchFilter.classList.toggle('open');
  }

  showDirectory = (isShow) => {
    this.refs.directory.classList.toggle('open', isShow);
  }  


  search = (filterOptions) => {

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      const tempFilter = filterOptions || {
        googleFontSearch : this.refs.searchFilterLayer.getSearchFilterOptions(),
        text : this.refs.search.getText() 
      }
  
      db.searchFiles(tempFilter, (files) => {
        this.refreshFiles(files);
      })
    }, 100);

  }

  toggleFavoriteList = (e) => {
    const $dom = e.target;
    $dom.classList.toggle('active');

    if ($dom.classList.contains('active')) {
      this.search({favorite: true});
    } else {
      this.search();
    }

  }

  dropFiles = (files) => {

    if (files && files.length) {
      db.updateFiles(files, () => {
        this.refreshAll();
      });
    }


  }

  openIconMaker = () => {
    shell.openExternal('http://www.fontmoa.com/icon/')
  }

  openFontEditor = () => {

    let link = "simple-en.html";
    const locale = intl.options.currentLocale;

    if (locale.includes('cn')) {
      link = "simple-cn.html";
    } else if (locale.includes('ko')) {
      link = "simple.html";
    }

    const targetLink = 'http://www.fontmoa.com/editor/v1/' + link;
    shell.openExternal(targetLink);
  }

  render() {
    return ( 
        <div className="window fontmanager-window font-manager" id={this.props.id}>
          <div className="app-menu">
            <SearchToolbar ref="search" search={this.search} />
            <FontToolbar search={this.search} showDirectory={this.showDirectory} />
          </div>
          <div ref="searchFilter" className="app-search-filter">
            <SearchFilterLayer ref="searchFilterLayer" search={this.search} />
          </div>
          <div className="app-content">
            <FontListView ref="fontlistview" />
          </div>
          <div className="app-bottom-toolbar">
            <span className="tools">
              <span onClick={this.openIconMaker} title="OpenSource Icon Optimizer"><i className="material-icons">insert_emoticon</i></span>
              <span onClick={this.openFontEditor} title="Font Editor"><i className="material-icons">format_shapes</i></span>

            </span>
          </div>
          <div ref="directory" className="app-directory">
            <DirectoryManager ref="dir" />
          </div>          
        </div>
    );
  }
}

export default FontManager;
