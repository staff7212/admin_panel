import React from 'react';

const ChooseModal = ({target, data, redirect}) => {

  const list = data.map(item => {
    if (item.time) {
      return (
        <li key={item.file}>
          <a 
            className="uk-link-muted uk-modal-close" 
            href='#'
            onClick={(e) => redirect(e, item.file)}>Резервная копия от {item.time}</a>
        </li>
      )
    } else {
      return (
        <li key={item}>
          <a 
            className="uk-link-muted uk-modal-close" 
            href='#'
            onClick={(e) => redirect(e, item)}>{item}</a>
        </li>
      )
    }
  })

  const message = data.length < 1 ? <div>Резервных копий нет</div> : null;

  return (
    <div id={target} uk-modal="true" container="false" >
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Открыть</h2>
        {message}
        <ul className="uk-list uk-list-divider">
          {list}
        </ul>
        <div className="uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
        </div>
      </div>
    </div>
  )
};

export default ChooseModal;