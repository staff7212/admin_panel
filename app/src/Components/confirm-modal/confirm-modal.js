import React from 'react';
import UIkit from 'uikit';

const ConfirmModal = ({target, method}) => {

  return (
    <div id={target} uk-modal="true" container="false" >
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Сохранение</h2>
        <p>Вы действительно хотите сохранить изменения?</p>
        <div className="uk-text-right">
          <button className="uk-button uk-button-default uk-margin-small-right uk-modal-close" type="button">Отменить</button>
          <button onClick={() => method(() => {
            UIkit.notification({message: 'Упешно сохранено', status: 'success'})
          },
          () => {
            UIkit.notification({message: 'Ошибка', status: 'danger'})
          })} className="uk-button uk-button-primary uk-modal-close" type="button">Сохранить</button>
        </div>
      </div>
    </div>
  )
};

export default ConfirmModal