import React, {Component} from 'react';


export default class EditorMeta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: {
        title: '',
        keywords: '',
        description: '',
      },
    }
  }

  componentDidMount() {
    this.getMeta(this.props.virtualDom)
  }

  componentDidUpdate(prevProps) {
    if (this.props.virtualDom !== prevProps.virtualDom) {
      this.getMeta(this.props.virtualDom);
    }
  }

  getMeta(virtualDom) {
    this.title = virtualDom.head.querySelector('title') || virtualDom.head.appendChild(virtualDom.createElement('title'));
    
    this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');
    if (!this.keywords) {
      this.keywords = virtualDom.head.appendChild(virtualDom.createElement('meta'));
      this.keywords.setAttribute("name", "keywords");
      this.keywords.setAttribute("content", "");
    }

    this.description = virtualDom.head.querySelector('meta[name="description"]');
    if (!this.description) {
      this.description = virtualDom.head.appendChild(virtualDom.createElement('meta'));
      this.description.setAttribute("name", "description");
      this.description.setAttribute("content", "");
    }

    this.setState({
        meta: {
          title: this.title.innerHTML,
          keywords: this.keywords.getAttribute("content"),
          description: this.description.getAttribute("content")
      }
    })

  }

  applyMeta() {
    this.title.innerHTML = this.state.meta.title;
    this.keywords.setAttribute("content", this.state.meta.keywords);
    this.description.setAttribute("content", this.state.meta.description);
  }

  onValueChange(e) {

    this.setState(({meta}) => {
      const newMeta = {
        ...meta,
        [e.target.name]: e.target.value
      };

      return {
        meta: newMeta
      }
    })

    console.log(this.state.meta);
  }

  render() {

    const {target} = this.props;
    const {title, keywords, description} = this.state.meta;

    return (
      <div id={target} uk-modal="true" container="false" >
        <div className="uk-modal-dialog uk-modal-body">
          <h2 className="uk-modal-title">Редактирование meta-тегов</h2>

          <form>
            <div className="uk-margin">
              <input name='title' className="uk-input" type="text" placeholder="Title" value={title} onChange={(e) => this.onValueChange(e)}/>
            </div>

            <div className="uk-margin">
              <textarea name='keywords' className="uk-textarea" rows="5" placeholder="Keywords" value={keywords} onChange={(e) => this.onValueChange(e)}></textarea>
            </div>

            <div className="uk-margin">
              <textarea name='description' className="uk-textarea" rows="5" placeholder="Description" value={description} onChange={(e) => this.onValueChange(e)}></textarea>
            </div>

          </form>


          <div className="uk-text-right">
            <button className="uk-button uk-button-default uk-margin-small-right uk-modal-close" type="button">Отменить</button>
            <button 
              className="uk-button uk-button-primary uk-modal-close"
              type="button"
              onClick={() => this.applyMeta()}>Применить</button>
          </div>
        </div>
      </div>
    )
  }
}
