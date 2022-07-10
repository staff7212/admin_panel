
import "../../helpers/iframeLoader.js";
import axios from 'axios';
import React, {Component} from 'react';

import DOMHelper from '../../helpers/dom-helper';
import EditorText from '../editor-text';

export default class Editor extends Component {
  constructor() {
    super();
    this.currentPage = "index.html";
    this.state = {
      pageList: [],
      newPageName: "",
    }
  }

  componentDidMount() {
    this.init(this.currentPage);
  }

  init(page) {
    this.iframe = document.querySelector('iframe');
    this.open(page);
    this.loadPageList();
  }

  open(page) {
    this.currentPage = page;

    axios
      .get(`../${page}?rnd=${Math.random()}`)
      .then(res => DOMHelper.parseStrToDOM(res.data))
      .then(DOMHelper.wrapTextNodes)
      .then(dom => {
        this.virtualDom = dom;
        return dom
      })
      .then(DOMHelper.serializeDOMToString)
      .then(html => axios.post("./api/saveTempPage.php", {html}))
      .then(() => this.iframe.load("../temp.html"))
      .then(() => this.enableEditing())
      .then(() => this.injectStyles());
  }

  save() {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    const html = DOMHelper.serializeDOMToString(newDom);
    axios
      .post("./api/savePage.php", {pageName: this.currentPage, html})
  }

  enableEditing() {
    this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach(element => {

      const id = element.getAttribute("nodeid");
      const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`)

      new EditorText(element, virtualElement);
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
    `;
    this.iframe.contentDocument.head.appendChild(style);
  }


  loadPageList() {
    axios
      .get("./api")
      .then(res => this.setState({pageList: res.data}))
  }

  createNewPage() {
    axios
      .post("./api/createNewPage.php", {"name": this.state.newPageName})
      .then(this.loadPageList())
      .catch(() => alert('Страница уже существует'))
  }

  deletePage(page) {
    axios
      .post("./api/deletePage.php", {"name": page})
      .then(this.loadPageList())
      .catch(() => alert('Страницы не существует'))
  }

  render() {
    return (
      <>
        <button onClick={() => this.save()}>Click</button>
        <iframe src={this.currentPage} frameBorder="0"></iframe>
      
      </>
    )
  }
}