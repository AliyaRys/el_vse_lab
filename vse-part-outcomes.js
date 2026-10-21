(function(){
  const directionMap={
    'Пригодно':['В реализацию без ограничений'],
    'Условно-пригодно':['На проварку','На обезвреживание','На утилизацию'],
    'Непригодно':['На утилизацию','На уничтожение']
  };

  function createOption(text,value){
    const option=document.createElement('option');
    option.textContent=text;
    option.value=value===undefined?text:value;
    return option;
  }

  function updateDirections(resultSelect,directionSelect,selectedDirection){
    const directions=directionMap[resultSelect.value]||[];
    directionSelect.replaceChildren(createOption('Выберите направление',''));
    directionSelect.firstElementChild.disabled=true;
    directions.forEach(direction=>directionSelect.append(createOption(direction)));
    directionSelect.disabled=!directions.length;
    if(selectedDirection&&directions.includes(selectedDirection))directionSelect.value=selectedDirection;
    else if(directions.length===1)directionSelect.value=directions[0];
    else directionSelect.value='';
    globalThis.MilkVseSelects?.refresh(directionSelect);
  }

  function render(container,parts,options={}){
    const allowConditional=options.allowConditional!==false;
    container.replaceChildren();
    parts.forEach((part,index)=>{
      const row=document.createElement('div');
      row.className='vse-outcome-row';
      row.dataset.part=part;
      const partLabel=document.createElement('div');
      partLabel.className='vse-outcome-part';
      partLabel.textContent=part;

      const resultControl=document.createElement('div');
      resultControl.className='vse-outcome-control';
      const resultLabel=document.createElement('label');
      resultLabel.htmlFor='vse-result-'+(index+1);
      resultLabel.innerHTML='Результат ВСЭ <span class="req">*</span>';
      const result=document.createElement('select');
      result.id='vse-result-'+(index+1);
      result.dataset.librarySelect='';
      result.name='vseResult[]';
      result.required=true;
      result.append(createOption('Выберите решение',''),createOption('Пригодно'));
      result.firstElementChild.disabled=true;
      if(allowConditional)result.append(createOption('Условно-пригодно'));
      result.append(createOption('Непригодно'));
      resultControl.append(resultLabel,result);

      const directionControl=document.createElement('div');
      directionControl.className='vse-outcome-control';
      const directionLabel=document.createElement('label');
      directionLabel.htmlFor='vse-direction-'+(index+1);
      directionLabel.innerHTML='Направление по результатам ВСЭ <span class="req">*</span>';
      const direction=document.createElement('select');
      direction.id='vse-direction-'+(index+1);
      direction.dataset.librarySelect='';
      direction.name='vseDirection[]';
      direction.required=true;
      direction.disabled=true;
      direction.append(createOption('Сначала выберите результат',''));
      const hidden=document.createElement('input');
      hidden.type='hidden';
      hidden.name='vsePart[]';
      hidden.value=part;
      directionControl.append(directionLabel,direction,hidden);

      result.addEventListener('change',()=>{
        updateDirections(result,direction);
        row.classList.remove('invalid');
        container.parentElement?.querySelector('.vse-outcome-error')?.classList.remove('visible');
      });
      direction.addEventListener('change',()=>row.classList.remove('invalid'));
      row.append(partLabel,resultControl,directionControl);
      container.append(row);
    });
  }

  function validate(container){
    let firstInvalid=null;
    container.querySelectorAll('.vse-outcome-row').forEach(row=>{
      const result=row.querySelector('[name="vseResult[]"]');
      const direction=row.querySelector('[name="vseDirection[]"]');
      const invalid=!result.value||!direction.value;
      row.classList.toggle('invalid',invalid);
      if(invalid&&!firstInvalid)firstInvalid=!result.value?result:direction;
    });
    const message=container.parentElement?.querySelector('.vse-outcome-error');
    if(message)message.classList.toggle('visible',Boolean(firstInvalid));
    if(firstInvalid)globalThis.MilkVseSelects?.focus(firstInvalid)||firstInvalid.focus();
    return !firstInvalid;
  }

  function collect(container){
    return [...container.querySelectorAll('.vse-outcome-row')].map(row=>({
      part:row.dataset.part,
      result:row.querySelector('[name="vseResult[]"]').value,
      direction:row.querySelector('[name="vseDirection[]"]').value
    }));
  }

  function appendToParams(params,outcomes){
    outcomes.forEach(outcome=>{
      params.append('vsePart[]',outcome.part);
      params.append('vseResult[]',outcome.result);
      params.append('vseDirection[]',outcome.direction);
    });
    return params;
  }

  function fromParams(params=new URLSearchParams(location.search)){
    const parts=params.getAll('vsePart[]');
    const results=params.getAll('vseResult[]');
    const directions=params.getAll('vseDirection[]');
    return parts.map((part,index)=>({part,result:results[index]||'',direction:directions[index]||''}));
  }

  function renderSaved(container,outcomes){
    container.replaceChildren();
    outcomes.forEach(outcome=>{
      const row=document.createElement('div');
      row.className='saved-vse-outcome';
      const part=document.createElement('strong');part.textContent=outcome.part;
      const result=document.createElement('span');result.textContent=outcome.result;
      const direction=document.createElement('span');direction.textContent=outcome.direction;
      row.append(part,result,direction);container.append(row);
    });
  }

  window.VsePartOutcomes={directionMap,render,validate,collect,appendToParams,fromParams,renderSaved};
})();
