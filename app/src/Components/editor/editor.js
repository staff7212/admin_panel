
import "../../helpers/iframeLoader.js";
import axios from 'axios';
import React, {Component} from 'react';
import UIkit from 'uikit';


import Panel from '../panel';
import ConfirmModal from "../confirm-modal";
import ChooseModal from "../choose-modal";
import DOMHelper from '../../helpers/dom-helper';
import EditorText from '../editor-text';
import EditorMeta from '../editor-meta';
import EditorImages from '../editor-images';

import Spinner from '../spinner';

export default class Editor extends Component {
  constructor() {
    super();
    this.currentPage = "index.html";
    this.state = {
      pageList: [],
      backupsList: [],
      newPageName: "",
      loading: true,
    }
    this.isLoading = this.isLoading.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
    this.save = this.save.bind(this);
    this.init = this.init.bind(this);
    this.restoreBackup = this.restoreBackup.bind(this);
  }

  componentDidMount() {
    this.init(null, this.currentPage);
  }

  init(e, page) {
    if (e) {
      e.preventDefault();
    }
    this.isLoading();
    this.iframe = document.querySelector('iframe');
    this.open(page, this.isLoaded);
    this.loadPageList();
    this.loadBackupsList();
  }

  open(page, cb) {
    this.currentPage = page;

    axios
      .get(`../${page}?rnd=${Math.random()}`)
      .then(res => DOMHelper.parseStrToDOM(res.data))
      .then(DOMHelper.wrapTextNodes)
      .then(DOMHelper.wrapImages)
      .then(dom => {
        this.virtualDom = dom;
        return dom
      })
      .then(DOMHelper.serializeDOMToString)
      .then(html => axios.post("./api/saveTempPage.php", {html}))
      .then(() => this.iframe.load("../1qaz2wsx3ed4rf.html"))
      .then(() => axios.post("./api/deleteTempPage.php"))
      .then(() => this.enableEditing())
      .then(() => this.injectStyles())
      .then(cb)
    
    this.loadBackupsList();
  }

  async save() {
    this.isLoading();
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    DOMHelper.unwrapImages(newDom);
    const html = DOMHelper.serializeDOMToString(newDom);
    await axios
      .post("./api/savePage.php", {pageName: this.currentPage, html})
      .then(() => this.showNotifications('Упешно сохранено', 'success'))
      .catch(() => this.showNotifications('Ошибка', 'danger'))
      .finally(this.isLoaded);

    this.loadBackupsList();
  }

  enableEditing() {
    this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach(element => {

      const id = element.getAttribute("nodeid");
      const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`)

      new EditorText(element, virtualElement);
    })

    this.iframe.contentDocument.body.querySelectorAll("[editableimgid]").forEach(element => {

      const id = element.getAttribute("editableimgid");
      const virtualElement = this.virtualDom.body.querySelector(`[editableimgid="${id}"]`)

      new EditorImages(element, virtualElement, this.isLoading, this.isLoaded, this.showNotifications);
    })
  }

  injectStyles() {
    const style =  this.iframe.contentDocument.createElement("style");
    style.innerHTML = `
      text-editor:hover {
        outline: 2px solid orange;
        outline-offser: 8px;
      }
      text-editor:focus {
        outline: 2px solid red;
        outline-offser: 8px;
      }
      [editableimgid]:hover {
        outline: 2px solid orange;
        outline-offser: 8px;
      }
    `;
    this.iframe.contentDocument.head.appendChild(style);
  }

  showNotifications(message, status) {
    UIkit.notification({message, status});
  }

  loadPageList() {
    axios
      .get("./api/pageList.php")
      .then(res => this.setState({pageList: res.data}))
  }

  loadBackupsList() {
    axios
      .get("./backups/backups.json")
      .then(res => this.setState({backupsList: res.data.filter(backup => {
        return backup.page === this.currentPage;
      })}))
  }

  restoreBackup(e, backup) {
    if (e) {
      e.preventDefault();
    }

    UIkit.modal.confirm("Вы действительно хотите востановить страницу?", {labels: {ok: "Востановить", cancel: "Отмена"}})
      .then(() => {
        this.isLoading();
        axios
          .post("./api/restoreBackup.php", {"page": this.currentPage, "file": backup})
      })
      .then(() => {
        this.open(this.currentPage, this.isLoaded)
      })
  }

  isLoading() {
    this.setState({loading: true});
  }

  isLoaded() {
    this.setState({loading: false});
  }

  render() {
    const {loading, pageList, backupsList} = this.state;

    let spinner = loading ? <Spinner active/> : <Spinner />

    return (
      <>
        <iframe src="" frameBorder="0"></iframe>

        <input id="img-upload" type="file" accept="image/*" style={{display: "none"}} />
        
        {spinner}

        <Panel/>

        <ConfirmModal target={'modal-save'} method={this.save}/>
        <ChooseModal data={pageList} target={'modal-open'} redirect={this.init}/>
        <ChooseModal data={backupsList} target={'modal-backup'} redirect={this.restoreBackup}/>
        {this.virtualDom ? <EditorMeta target={"modal-meta"} virtualDom={this.virtualDom}/> : null}
      </>
    )
  }
}