(function(){
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,symbol=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[symbol]);

  function hash(value){
    let result=0;
    for(let index=0;index<value.length;index++)result=(result*31+value.charCodeAt(index))>>>0;
    return result;
  }

  function readState(key){try{return JSON.parse(sessionStorage.getItem(key)||'null')}catch(error){return null}}
  function writeState(key,value){try{sessionStorage.setItem(key,JSON.stringify(value))}catch(error){}}

  function getPartVolume(item,context){
    const configured=context.partVolumes?.[item.part];
    if(configured)return configured;
    const match=String(item.part).match(/·\s*([\d.,]+)\s*(кг|л)\s*$/i);
    if(match)return{value:match[1],unit:match[2].toLowerCase()};
    if(context.partValue)return{value:context.partValue,unit:context.unit||'кг'};
    return{value:'1',unit:context.unit||'шт.'};
  }

  function createDocumentNumbers(context,directions){
    const dateDigits=String(context.issueDate||'12.08.2026').replace(/\D/g,'').slice(0,8);
    const prefix=(dateDigits.slice(6,8)||'26')+(dateDigits.slice(2,4)||'08')+(dateDigits.slice(0,2)||'12');
    return directions.map((direction,index)=>{
      const serial=String((hash((context.recordId||'vse')+direction)+index)%90000+10000);
      return'RU016:'+prefix+'-'+serial;
    });
  }

  function destinationCards(directions){
    return directions.map((direction,index)=>{
      const suffix=index+1;
      return'<article class="transport-vsd-recipient">'+
        '<div class="transport-vsd-recipient-head"><strong>Получатель '+suffix+'</strong></div>'+
        '<div class="transport-vsd-grid">'+
          '<label class="transport-vsd-field"><span>Фирма-получатель <b>*</b></span><input name="consignee-'+suffix+'" required></label>'+
          '<label class="transport-vsd-field"><span>Предприятие-получатель <b>*</b></span><input name="consignee-enterprise-'+suffix+'" required></label>'+
          '<label class="transport-vsd-field full"><span>Адрес места назначения <b>*</b></span><input name="destination-address-'+suffix+'" required></label>'+
        '</div></article>';
    }).join('');
  }

  function productRows(restricted,context){
    return restricted.map(item=>{
      const amount=getPartVolume(item,context);
      return'<tr><td><strong>'+escapeHtml(item.part)+'</strong><span>'+escapeHtml(context.packaging||'Без упаковки')+'</span></td><td>'+escapeHtml(context.product||'Подконтрольная продукция')+'</td><td>'+escapeHtml(amount.value)+' '+escapeHtml(amount.unit)+'</td><td><span class="transport-vsd-result-tag">'+escapeHtml(item.result)+'</span></td><td><strong class="transport-vsd-direction">'+escapeHtml(item.direction)+'</strong></td></tr>';
    }).join('');
  }

  function buildForm(restricted,context,directions){
    const specialMarks=restricted.map(item=>item.part+': '+item.result+', '+item.direction).join('; ');
    return'<form class="transport-vsd-form">'+
      '<fieldset class="transport-vsd-section"><legend><span>1</span> Транзакция и отправитель</legend><div class="transport-vsd-grid">'+
        '<label class="transport-vsd-field"><span>Тип транзакции <b>*</b></span><select name="transaction-type" required><option selected>'+escapeHtml(context.transactionType||'Перевозка без смены владельца')+'</option><option>Перевозка со сменой владельца</option><option>Смена владельца без перевозки</option></select></label>'+
        '<label class="transport-vsd-field"><span>Основание</span><input value="Результаты ВСЭ № '+escapeHtml(context.vseNumber||'—')+'" readonly></label>'+
        '<label class="transport-vsd-field"><span>Хозяйствующий субъект-отправитель</span><input value="'+escapeHtml(context.consignor||'Владелец продукции')+'" readonly></label>'+
        '<label class="transport-vsd-field"><span>Предприятие-отправитель</span><input value="'+escapeHtml(context.consignorEnterprise||'Лаборатория ВСЭ №1 г. Казань')+'" readonly></label>'+
        '<label class="transport-vsd-field"><span>Исходный транспортный эВСД</span><input value="'+escapeHtml(context.sourceVsd||'—')+'" readonly></label>'+
        '<label class="transport-vsd-field"><span>Запись складского журнала</span><input value="'+escapeHtml(context.journalEntry||('Партия по эВСД '+(context.sourceVsd||'—')))+'" readonly></label>'+
      '</div></fieldset>'+
      '<fieldset class="transport-vsd-section"><legend><span>2</span> Получатель и место назначения</legend><div class="transport-vsd-recipient-list">'+destinationCards(directions)+'</div></fieldset>'+
      '<fieldset class="transport-vsd-section"><legend><span>3</span> Транспортировка</legend><div class="transport-vsd-grid">'+
        '<label class="transport-vsd-field"><span>Вид транспорта <b>*</b></span><select name="transport-type" required><option selected>Автомобильный</option><option>Железнодорожный</option><option>Морской</option><option>Воздушный</option></select></label>'+
        '<label class="transport-vsd-field"><span>Страна регистрации ТС <b>*</b></span><select name="vehicle-country" required><option selected>'+escapeHtml(context.vehicleCountry||'Россия')+'</option></select></label>'+
        '<label class="transport-vsd-field"><span>Номер автомашины <b>*</b></span><input name="vehicle-number" value="'+escapeHtml(context.vehicleNumber||'А000АА 116')+'" required></label>'+
        '<label class="transport-vsd-field"><span>Номер прицепа / контейнера</span><input name="trailer-number" value="'+escapeHtml(context.trailerNumber||'Не указан')+'"></label>'+
        '<label class="transport-vsd-field"><span>Способ хранения при перевозке <b>*</b></span><select name="storage-method" required><option selected>'+escapeHtml(context.storageMethod||'Охлажденные')+'</option><option>Замороженные</option><option>Охлаждаемые</option><option>Вентилируемые</option></select></label>'+
        '<label class="transport-vsd-field"><span>Перевозчик</span><input name="carrier" value="'+escapeHtml(context.carrier||context.consignor||'Владелец продукции')+'"></label>'+
      '</div></fieldset>'+
      '<fieldset class="transport-vsd-section"><legend><span>4</span> Продукция и направление</legend><div class="transport-vsd-products"><table><thead><tr><th>Маркировка / часть</th><th>Продукция</th><th>Объём</th><th>Результат ВСЭ</th><th>Цель перевозки</th></tr></thead><tbody>'+productRows(restricted,context)+'</tbody></table></div><div class="transport-vsd-grid transport-vsd-product-details">'+
        '<label class="transport-vsd-field"><span>Качественный статус груза</span><input value="Некачественный груз" readonly></label>'+
        '<label class="transport-vsd-field"><span>Ветеринарно-санитарная экспертиза</span><input value="Подвергнута ВСЭ в полном объёме" readonly></label>'+
        (context.productionDate?'<label class="transport-vsd-field"><span>Дата выработки продукции</span><input value="'+escapeHtml(context.productionDate)+'" readonly></label>':'')+
        '<label class="transport-vsd-field '+(context.productionDate?'':'full')+'"><span>Упаковка</span><input value="'+escapeHtml(context.packaging||'Без упаковки')+'" readonly></label>'+
        '<label class="transport-vsd-field full"><span>Особые отметки</span><textarea name="special-marks" rows="2">'+escapeHtml('ВСЭ № '+(context.vseNumber||'—')+'. '+specialMarks)+'</textarea></label>'+
      '</div></fieldset>'+
      '<fieldset class="transport-vsd-section"><legend><span>5</span> Сопроводительные документы</legend><div class="transport-vsd-grid">'+
        '<label class="transport-vsd-field"><span>Товарно-транспортная накладная <b>*</b></span><select name="ttn-mode" data-ttn-mode required><option selected value="none">ТТН отсутствует</option><option value="specified">Указать ТТН</option></select></label>'+
        '<label class="transport-vsd-field"><span>Тип документа</span><select name="ttn-type" data-ttn-dependent disabled><option selected>Товарно-транспортная накладная</option><option>Транспортная накладная</option></select></label>'+
        '<label class="transport-vsd-field"><span>Номер ТТН</span><input name="ttn-number" data-ttn-dependent placeholder="—" disabled></label>'+
        '<label class="transport-vsd-field"><span>Дата ТТН</span><input name="ttn-date" data-ttn-dependent type="date" value="'+escapeHtml(context.ttnDate||'2026-08-12')+'" disabled></label>'+
      '</div></fieldset>'+
      '<div class="transport-vsd-actions"><button class="btn secondary" type="button" data-transport-close>Позже</button><button class="btn primary" type="submit" data-transport-create>Создать транспортный эВСД</button></div>'+
    '</form>';
  }

  function createSuccessDialog(numbers,directions){
    const backdrop=document.createElement('div');
    backdrop.className='transport-vsd-success-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    backdrop.innerHTML='<section class="transport-vsd-success" role="dialog" aria-modal="true" aria-labelledby="transport-vsd-success-title"><div class="transport-vsd-success-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></div><h2 id="transport-vsd-success-title">Транспортный эВСД создан</h2><p>Документ зарегистрирован для перевозки продукции по выбранному направлению.</p><div class="transport-vsd-success-list">'+numbers.map((number,index)=>'<div><span>'+escapeHtml(directions[index])+'</span><strong>'+escapeHtml(number)+'</strong></div>').join('')+'</div><button class="btn primary" type="button" data-success-close>Закрыть</button></section>';
    document.body.append(backdrop);
    const close=()=>{backdrop.classList.remove('open');backdrop.setAttribute('aria-hidden','true')};
    backdrop.querySelector('[data-success-close]').addEventListener('click',close);
    backdrop.addEventListener('click',event=>{if(event.target===backdrop)close()});
    return{open(){backdrop.classList.add('open');backdrop.setAttribute('aria-hidden','false');backdrop.querySelector('[data-success-close]').focus()},close};
  }

  function init(options={}){
    const outcomes=options.outcomes?.length?options.outcomes:(window.VsePartOutcomes?.fromParams()||[]);
    const restricted=outcomes.filter(item=>item.result==='Условно-пригодно'||item.result==='Непригодно');
    if(!restricted.length)return;

    const context=options.context||{};
    const directions=[...new Set(restricted.map(item=>item.direction).filter(Boolean))];
    const signature=JSON.stringify(restricted.map(item=>[item.part,item.result,item.direction]));
    const stateKey='transportVsdState:v3:'+(context.recordId||location.pathname)+':'+hash(signature);
    const savedState=readState(stateKey);
    if(savedState?.status==='created')return;

    const backdrop=document.createElement('div');
    backdrop.className='transport-vsd-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    backdrop.innerHTML='<section class="transport-vsd-dialog" role="dialog" aria-modal="true" aria-labelledby="transport-vsd-title"><div class="transport-vsd-head"><div><p class="transport-vsd-kicker">Исходящая партия</p><h2 id="transport-vsd-title">Создание транспортного эВСД</h2></div><button class="transport-vsd-close" type="button" aria-label="Закрыть">×</button></div><div class="transport-vsd-body">'+buildForm(restricted,context,directions)+'</div></section>';
    document.body.append(backdrop);

    const form=backdrop.querySelector('.transport-vsd-form');
    const success=createSuccessDialog(createDocumentNumbers(context,directions),directions);
    let returnFocus=document.activeElement;
    let reopenButton=null;

    function ensurePanel(){
      let panel=document.querySelector('.conclusion-panel, .actions, .transport-vsd-panel');
      if(!panel){
        panel=document.createElement('div');
        panel.className='transport-vsd-panel';
        panel.setAttribute('aria-label','Действия с записью ВСЭ');
        document.querySelector('main')?.append(panel);
      }
      if(reopenButton||panel.querySelector('[data-transport-reopen]'))return;
      reopenButton=document.createElement('button');
      reopenButton.className='action-btn tooltip transport-vsd-reopen';
      reopenButton.type='button';
      reopenButton.dataset.transportReopen='';
      reopenButton.dataset.tooltip='Оформить транспортный эВСД';
      reopenButton.setAttribute('aria-label','Оформить транспортный эВСД');
      reopenButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>';
      reopenButton.addEventListener('click',open);
      panel.prepend(reopenButton);
    }

    function open(){
      returnFocus=document.activeElement;
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden','false');
      document.body.classList.add('transport-vsd-modal-open');
      backdrop.querySelector('.transport-vsd-close').focus();
    }

    function close({defer=true}={}){
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden','true');
      document.body.classList.remove('transport-vsd-modal-open');
      if(defer){writeState(stateKey,{status:'deferred'});ensurePanel()}
      if(returnFocus?.focus)returnFocus.focus();
    }

    backdrop.querySelector('.transport-vsd-close').addEventListener('click',()=>close());
    backdrop.querySelector('[data-transport-close]').addEventListener('click',()=>close());
    backdrop.addEventListener('click',event=>{if(event.target===backdrop)close()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&backdrop.classList.contains('open'))close()});

    const ttnMode=form.querySelector('[data-ttn-mode]');
    const updateTtn=()=>{
      const enabled=ttnMode.value==='specified';
      form.querySelectorAll('[data-ttn-dependent]').forEach(field=>{field.disabled=!enabled;field.required=enabled&&field.name!=='ttn-type'});
    };
    ttnMode.addEventListener('change',updateTtn);
    updateTtn();

    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const numbers=createDocumentNumbers(context,directions);
      writeState(stateKey,{status:'created',numbers});
      reopenButton?.remove();
      reopenButton=null;
      close({defer:false});
      success.open();
    });

    if(savedState?.status==='deferred')ensurePanel();
    else requestAnimationFrame(open);
  }

  window.VseTransportVsd={init};
})();
