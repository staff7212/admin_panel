import React from 'react';

const ChooseModal = ({target, data, redirect}) => {

  const pageList = data.map(list => {
    return (
      <li key={list}>
        <a 
          className="uk-link-muted uk-modal-close" 
          href='#'
          onClick={(e) => redirect(e, list)}>{list}</a>
      </li>

    )
  })
  return (
    <div id={target} uk-modal="true" container="false" >
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Открыть</h2>
        <ul className="uk-list uk-list-divider">
          {pageList}
        </ul>
        <div className="uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
        </div>
      </div>
    </div>
  )
};

export default ChooseModal;