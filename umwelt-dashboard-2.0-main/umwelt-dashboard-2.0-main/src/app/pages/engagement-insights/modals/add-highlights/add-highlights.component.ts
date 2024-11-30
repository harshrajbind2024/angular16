import { Component, OnInit,Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
@Component({
  selector: 'app-add-highlights',
  templateUrl: './add-highlights.component.html',
  styleUrls: ['./add-highlights.component.scss']
})
export class AddHighlightsComponent implements OnInit {
  constructor(
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: any,
    public dialogRef: MatLegacyDialogRef<AddHighlightsComponent>,
  ) { }
  customfill = '';
  dataCopy:any = {}
  displayedColumns:any = []
  valueType;
  ngOnInit() {
    this.dataCopy = JSON.parse(JSON.stringify(this.data))
    this.valueType = this.dataCopy['valueType']
    if (!this.dataCopy.respondentFlag){
      if(!(['top','bottom'].includes(this.dataCopy.type))){
        this.dataCopy[this.dataCopy.type] = this.dataCopy[this.dataCopy.type].map((d:any,i:any)=>{
          return{...d,index:i}
        })
      }
      if(this.dataCopy.type=='greater' || this.dataCopy.type=='lesser'){
        this.displayedColumns = ['index','Value','label','with','fill','customfill','delete']
      }
      if(this.dataCopy.type=='between'){
        this.displayedColumns = ['index','Value','Value2','label','with','fill','customfill','delete']
      }
      if(this.dataCopy.type=='top' || this.dataCopy.type=='bottom'){
        this.displayedColumns = ['Value']
      }
    }else{
      this.displayedColumns = ['RespondentValue']
    }
  }

  error = ''
  submit(){
    let status = this.validateErrorAll()
    if (!(['top','bottom'].includes(this.dataCopy.type)) && !this.dataCopy.respondentFlag){
      let dataArray = this.dataCopy[this.dataCopy.type]
      const newArray = dataArray.map(item => {
        if (this.valueType == 'percentage') {
          item.value = (item.pervalue / 100) * 5;
          if (this.dataCopy.type=='between'){
            item.value2 = (item.pervalue2 / 100) * 5;
          }
        } else {
          item.pervalue = Math.round((item.value / 5) * 100);
          if (this.dataCopy.type=='between'){
            item.pervalue2 = Math.round((item.value2 / 5) * 100);
          }
        }
      });
    }

    // let dataArray = this.dataCopy[this.dataCopy.type]
    // const newArray = dataArray.map(item => {
    //   if (this.valueType == 'percentage') {
    //     if (!(item.value)){
    //       item.value = (item.pervalue / 100) * 5;
    //     }
    //     if (this.dataCopy.type=='between' && !(item.value2)){
    //       item.value2 = (item.pervalue2 / 100) * 5;
    //     }
    //   } else {
    //     if (!(item.pervalue)){
    //       item.pervalue = (item.value / 5) * 100;
    //     }
    //     if (this.dataCopy.type=='between' && !(item.pervalue2)){
    //       item.pervalue2 = (item.value2 / 5) * 100;
    //     }
    //   }
    // });

    if(status) this.dialogRef.close(this.dataCopy[this.dataCopy.type])
  }

  validateError(elem?) {
    let isErr = false;

    let currElem = elem
    let currIndex = this.dataCopy[this.dataCopy.type].indexOf(currElem);

    for (let index = 0; index < this.dataCopy[this.dataCopy.type].length; index++) {
      const element = this.dataCopy[this.dataCopy.type][index];


      if (this.valueType == 'percentage' && !(['top','bottom'].includes(this.dataCopy.type))) {
        if (!element.pervalue && element.pervalue == null) {
          isErr = true;
          this.error = 'Please enter value to continue';
          break;
        }
        if (element.pervalue > 100 || element.pervalue < 0){
          isErr = true
          this.error = 'Please enter value between 0 to 100'
          break;
        }
        if (this.dataCopy.type=='between' && (!element.pervalue2 && element.pervalue2==null)){
          isErr = true
          this.error = 'Please enter values to continue'
          break;
        }
        if (this.dataCopy.type=='between' && (element.pervalue > 100 || element.pervalue < 0)){
          isErr = true
          this.error = 'Please enter value between 0 to 100'
          break;
        }
        if (this.dataCopy.type=='between' && (element.pervalue <= element.pervalue2 || element.pervalue2 >= element.pervalue)){
          isErr = true
          this.error = 'Value should be greater than the adjacent Value2'
          break;
        }

        if (currIndex > 0) {

          const previousElement = this.dataCopy[this.dataCopy.type][currIndex-1];
          const currentElement = this.dataCopy[this.dataCopy.type][currIndex];
          const belowElement = this.dataCopy[this.dataCopy.type][currIndex+1];

          if (this.dataCopy.type == 'greater') {
            if ((previousElement.pervalue || previousElement.pervalue==0) && currentElement.pervalue >= previousElement.pervalue) {
              isErr = true;
              this.error = 'Please enter a value lesser than the above added value';
              break;
            }
            if (belowElement && (belowElement.pervalue || belowElement.pervalue == 0) && currentElement.pervalue <= belowElement.pervalue) {
              isErr = true;
              this.error = 'Please enter a value greater than the below added value';
              break;
            }

          } else if (this.dataCopy.type == 'lesser') {
            if (!currentElement.pervalue && currentElement.pervalue==null){
              isErr = true;
              this.error = 'Please enter value to continue';
              break;
            }
            if ((previousElement.pervalue || previousElement.pervalue==0) && currentElement.pervalue <= previousElement.pervalue) {
              isErr = true;
              this.error = 'Please enter a value greater than the above added value';
              break;
            }
            if (belowElement && (belowElement.pervalue || belowElement.pervalue == 0) && currentElement.pervalue >= belowElement.pervalue) {
              isErr = true;
              this.error = 'Please enter a value lesser than the below added value';
              break;
            }
          }
          else {

            if ((previousElement.pervalue2 || previousElement.pervalue2==0) && currentElement.pervalue > previousElement.pervalue2) {
              isErr = true;
              this.error = 'Value should be lesser than the above added Value2';
              break;
            }
            if (belowElement && (belowElement.pervalue || belowElement.pervalue==0) && currentElement.pervalue2 < belowElement.pervalue) {
              isErr = true;
              this.error = 'Value2 should be greater than the below added Value';
              break;
            }
          }
        } 
        else if (currIndex==0) {

          const belowElement = this.dataCopy[this.dataCopy.type][currIndex+1];
          const currentElement = this.dataCopy[this.dataCopy.type][currIndex];

          if (this.dataCopy.type == 'greater') {
            if (belowElement && (belowElement.pervalue || belowElement.pervalue == 0) && currentElement.pervalue <= belowElement.pervalue) {
              isErr = true;
              this.error = 'Please enter a value greater than the below added value';
              break;
            }
          } else if (this.dataCopy.type == 'lesser') {
            if (belowElement && (belowElement.pervalue || belowElement.pervalue == 0) && currentElement.pervalue >= belowElement.pervalue) {
              isErr = true;
              this.error = 'Please enter a value lesser than the below added value';
              break;
            }
          }
          else {
            if (belowElement && (belowElement.pervalue || belowElement.pervalue==0) && currentElement.pervalue2 < belowElement.pervalue) {
              isErr = true;
              this.error = 'Value2 should be greater than the below added Value';
              break;
            }
          }
        }
      } 
      else if (this.valueType == 'value' || (['top','bottom'].includes(this.dataCopy.type))) {

        if (!element.value && element.value == null) {
          isErr = true;
          this.error = 'Please enter value to continue';
          break;
        }
        if (!(['top','bottom'].includes(this.dataCopy.type)) && element.value > 5 || element.value < 0){
          isErr = true
          this.error = 'Please enter value between 0 to 5'
          break;
        }
        if (this.dataCopy.type=='between' && (!element.value2 && element.value2==null)){
          isErr = true
          this.error = 'Please enter values to continue'
          break;
        }
        if (this.dataCopy.type=='between' && (element.value > 5 || element.value < 0)){
          isErr = true
          this.error = 'Please enter value between 0 to 5'
          break;
        }
        if (this.dataCopy.type=='between' && (element.value <= element.value2 || element.value2 >= element.value)){
          isErr = true
          this.error = 'Value should be greater than the adjacent Value2'
          break;
        }

        if (currIndex > 0) {

          const previousElement = this.dataCopy[this.dataCopy.type][currIndex-1];
          const currentElement = this.dataCopy[this.dataCopy.type][currIndex];
          const belowElement = this.dataCopy[this.dataCopy.type][currIndex+1];

          if (this.dataCopy.type == 'greater') {

            if ((previousElement.value || previousElement.value==0) && currentElement.value >= previousElement.value) {
              isErr = true;
              this.error = 'Please enter a value lesser than the above added value';
              break;
            }
            if (belowElement && (belowElement.value || belowElement.value == 0) && currentElement.value <= belowElement.value) {
              isErr = true;
              this.error = 'Please enter a value greater than the below added value';
              break;
            }

          } else if (this.dataCopy.type == 'lesser') {
            if (!currentElement.value && currentElement.value==null){
              isErr = true;
              this.error = 'Please enter value to continue';
              break;
            }
            if ((previousElement.value || previousElement.value==0) && currentElement.value <= previousElement.value) {
              isErr = true;
              this.error = 'Please enter a value greater than the above added value';
              break;
            }
            if (belowElement && (belowElement.value || belowElement.value == 0) && currentElement.value >= belowElement.value) {
              isErr = true;
              this.error = 'Please enter a value lesser than the below added value';
              break;
            }
          }
          else {

            if ((previousElement.value2 || previousElement.value2==0) && currentElement.value >= previousElement.value2) {
              isErr = true;
              this.error = 'Value should be lesser than the above added Value2';
              break;
            }
            if (belowElement && (belowElement.value || belowElement.value==0) && currentElement.value2 <= belowElement.value) {
              isErr = true;
              this.error = 'Value2 should be greater than the below added Value';
              break;
            }
          }
        } 
        else if (currIndex==0) {

          const belowElement = this.dataCopy[this.dataCopy.type][currIndex+1];
          const currentElement = this.dataCopy[this.dataCopy.type][currIndex];

          if (this.dataCopy.type == 'greater') {
            if (belowElement && (belowElement.value || belowElement.value == 0) && currentElement.value <= belowElement.value) {
              isErr = true;
              this.error = 'Please enter a value greater than the below added value';
              break;
            }
          } else if (this.dataCopy.type == 'lesser') {
            if (belowElement && (belowElement.value || belowElement.value == 0) && currentElement.value >= belowElement.value) {
              isErr = true;
              this.error = 'Please enter a value lesser than the below added value';
              break;
            }
          }
          else {
            if (belowElement && (belowElement.value || belowElement.value==0) && currentElement.value2 <= belowElement.value) {
              isErr = true;
              this.error = 'Value2 should be greater than the below added Value';
              break;
            }
          }
        }
      }

      if (!element.bg && (!['top', 'bottom'].includes(this.dataCopy.type))) {
        isErr = true;
        this.error = 'Please select fill color to continue';
        break;
      }
      if (!element.label && (!['top', 'bottom'].includes(this.dataCopy.type))) {
        isErr = true;
        this.error = 'Please enter label to continue';
        break;
      }
    }

    if (isErr) return false;
    this.error = '';
    return true;
  }

  validateErrorAll(){
    let isErr = false
    if (!this.dataCopy.respondentFlag){
      this.dataCopy[this.dataCopy.type].forEach(element => {
        if(!element.bg && (!['top','bottom'].includes(this.dataCopy.type))){
          isErr = true
          this.error = 'Please select fill color to continue'
        }
        if(!element.label && (!['top','bottom'].includes(this.dataCopy.type))){
          isErr = true
          this.error = 'Please enter label to continue'
        }
        if (this.valueType == 'percentage' && (!['top','bottom'].includes(this.dataCopy.type))){
          if(!element.pervalue && element.pervalue!==0){
            isErr = true
            this.error = 'Please enter value to continue'
          }
          if(!element.pervalue2 && this.dataCopy.type=='between' && element.pervalue2!=0){
            isErr = true
            this.error = 'Please enter values to continue'
          }
        }else if (this.valueType == 'value' || (['top','bottom'].includes(this.dataCopy.type))){
          if(!element.value && element.value!==0){
            isErr = true
            this.error = 'Please enter value to continue'
          }
          if(!element.value2 && this.dataCopy.type=='between' && element.value2!=0){
            isErr = true
            this.error = 'Please enter values to continue'
          }
        }
      });
    }
    if (this.dataCopy.respondentFlag){
      let val = this.dataCopy[this.dataCopy.type][0]['value']
      if (!val || val == null){
        isErr = true
        this.error = 'Please enter value to continue'
      }
    }
    if (isErr) return false
    this.error = ''
    return true
  }

  validateErrorOld(element?){
    let isErr = false
    let index = this.dataCopy[this.dataCopy.type].indexOf(element);
    if(!element.bg && (!['top','bottom'].includes(this.dataCopy.type))){
      isErr = true
      this.error = 'Please select fill color to continue'
    }
    if(!element.label && (!['top','bottom'].includes(this.dataCopy.type))){
      isErr = true
      this.error = 'Please enter label to continue'
    }

    if (this.valueType == 'percentage'){
      //percentage block starts
      if(!element.pervalue && element.pervalue==null){
        isErr = true
        this.error = 'Please enter value to continue'
      }else{
        //when element is not null block starts
        if(element.pervalue > 100 || element.pervalue < 0){
          isErr = true
          this.error = 'Please enter value between 0 to 100'
        }
        if (index > 0) { 
          //selected element is not first element block starts
          const previousElement = this.dataCopy[this.dataCopy.type][index - 1];
          const afterElement = this.dataCopy[this.dataCopy.type][index + 1];

          if (this.dataCopy.type == 'lesser'){
            if (element.pervalue <= previousElement.pervalue) {
              isErr = true
              this.error = 'Please enter the value greater than the above added value'
            }
            if (afterElement && element.pervalue >= afterElement.pervalue){
              isErr = true
              this.error = 'Please enter the value lesser than the below added value'
            }

          }else if (this.dataCopy.type == 'greater'){
            if (element.pervalue >= previousElement.pervalue) {
              isErr = true
              this.error = 'Please enter the value lesser than the above added value'
            }
            if (afterElement && element.pervalue <= afterElement.pervalue){
              isErr = true
              this.error = 'Please enter the value greater than the below added value'
            }

          }else{
            if (element.pervalue > previousElement.pervalue) {
              isErr = true
              this.error = 'Please enter the value lesser than the above added value'
            }
            if (afterElement && element.pervalue < afterElement.pervalue){
              isErr = true
              this.error = 'Please enter the value greater than the below added value'
            }
          }

          //selected element is not first element block ends
        }
        else if (index == 0){
          //selected element is first element block starts

          if (this.dataCopy[this.dataCopy.type].length > 1){
            const belowElement = this.dataCopy[this.dataCopy.type][index + 1];

            if (this.dataCopy.type == 'lesser'){
              if (element.pervalue >= belowElement.pervalue) {
                isErr = true
                this.error = 'Please enter the value lesser than the below added value'
              }

            }else if (this.dataCopy.type == 'greater'){
              if (element.pervalue <= belowElement.pervalue) {
                isErr = true
                this.error = 'Please enter the value greater than the below added value'
              }

            }else{
              if (element.pervalue < belowElement.pervalue) {
                isErr = true
                this.error = 'Please enter the value greater than the below added value'
              }
            }
          }
          //selected element is first element block ends
        }
        //pervalue2 block starts
        if(!element.pervalue2 && this.dataCopy.type=='between' && element.pervalue2==null){
          isErr = true
          this.error = 'Please enter values to continue'
        }else{
          //when pervalue2 is not null block starts
          if(element.pervalue2 > 100 || element.pervalue2 < 0){
            isErr = true
            this.error = 'Please enter value between 0 to 100'
          }
          if (element.pervalue <= element.pervalue2 && this.dataCopy.type=='between'){
            isErr = true
            this.error = 'Value should be greater than the adjacent Value2'
          }
          if (index > 0 && this.dataCopy.type=='between')  {
            const previousElement = this.dataCopy[this.dataCopy.type][index - 1];
            const afterElement = this.dataCopy[this.dataCopy.type][index + 1];

            if (element.pervalue2 > previousElement.pervalue) {
              isErr = true
              this.error = 'Value2 should be lesser than the above added Value'
            }
            if (element.pervalue > previousElement.pervalue2) {
              isErr = true
              this.error = 'Value should be lesser than the above added Value2'
            }
            if (afterElement && element.pervalue2 < afterElement.pervalue) {
              isErr = true
              this.error = 'Value2 should be greater than the below added Value'
            }
          }
          else if (index == 0 && this.dataCopy.type=='between'){
            if (this.dataCopy[this.dataCopy.type].length > 1){
              const belowElement = this.dataCopy[this.dataCopy.type][index + 1];
              if (element.pervalue2 < belowElement.pervalue) {
                isErr = true
                this.error = 'Value2 should be greater than the below added Value'
              }
            }
          }
          //when pervalue2 is not null block ends
        }
        //when element is not null block ends
      }
      //percentage block ends
    }
    else{
      //value block starts
      if(!element.value && element.value==null){
        isErr = true
        this.error = 'Please enter value to continue'
      }else{
        //when element is not null block starts
        if(element.value > 5 || element.value < 0){
          isErr = true
          this.error = 'Please enter value between 0 to 100'
        }
        if (index > 0) { 
          //selected element is not first element block starts
          const previousElement = this.dataCopy[this.dataCopy.type][index - 1];
          const afterElement = this.dataCopy[this.dataCopy.type][index + 1];

          if (this.dataCopy.type == 'lesser'){
            if (element.value <= previousElement.value) {
              isErr = true
              this.error = 'Please enter the value greater than the above added value'
            }
            if (afterElement && element.value >= afterElement.value){
              isErr = true
              this.error = 'Please enter the value lesser than the below added value'
            }

          }else if (this.dataCopy.type == 'greater'){
            if (element.value >= previousElement.value) {
              isErr = true
              this.error = 'Please enter the value lesser than the above added value'
            }
            if (afterElement && element.value <= afterElement.value){
              isErr = true
              this.error = 'Please enter the value greater than the below added value'
            }

          }else{
            if (element.value > previousElement.value) {
              isErr = true
              this.error = 'Please enter the value lesser than the above added value'
            }
            if (afterElement && element.value < afterElement.value){
              isErr = true
              this.error = 'Please enter the value greater than the below added value'
            }
          }

          //selected element is not first element block ends
        }
        else if (index == 0){
          //selected element is first element block starts

          if (this.dataCopy[this.dataCopy.type].length > 1){
            const belowElement = this.dataCopy[this.dataCopy.type][index + 1];

            if (this.dataCopy.type == 'lesser'){
              if (element.value >= belowElement.value) {
                isErr = true
                this.error = 'Please enter the value lesser than the below added value'
              }

            }else if (this.dataCopy.type == 'greater'){
              if (element.value <= belowElement.value) {
                isErr = true
                this.error = 'Please enter the value greater than the below added value'
              }

            }else{
              if (element.value < belowElement.value) {
                isErr = true
                this.error = 'Please enter the value greater than the below added value'
              }
            }
          }
          //selected element is first element block ends
        }
        //value2 block starts
        if(!element.value2 && this.dataCopy.type=='between' && element.value2==null){
          isErr = true
          this.error = 'Please enter values to continue'
        }else{
          //when value2 is not null block starts
          if(element.value2 > 5 || element.value2 < 0){
            isErr = true
            this.error = 'Please enter value between 0 to 100'
          }
          if (element.value <= element.value2 && this.dataCopy.type=='between'){
            isErr = true
            this.error = 'Value should be greater than the adjacent Value2'
          }
          if (index > 0 && this.dataCopy.type=='between')  {
            const previousElement = this.dataCopy[this.dataCopy.type][index - 1];
            const afterElement = this.dataCopy[this.dataCopy.type][index + 1];

            if (element.value2 > previousElement.value) {
              isErr = true
              this.error = 'Value2 should be lesser than the above added Value'
            }
            if (element.value > previousElement.value2) {
              isErr = true
              this.error = 'Value should be lesser than the above added Value2'
            }
            if (afterElement && element.value2 < afterElement.value) {
              isErr = true
              this.error = 'Value2 should be greater than the below added Value'
            }
          }
          else if (index == 0 && this.dataCopy.type=='between'){
            if (this.dataCopy[this.dataCopy.type].length > 1){
              const belowElement = this.dataCopy[this.dataCopy.type][index + 1];
              if (element.value2 < belowElement.value) {
                isErr = true
                this.error = 'Value2 should be greater than the below added Value'
              }
            }
          }
          //when value2 is not null block ends
        }
        //when element is not null block ends
      }
      //value block ends
    }
    if (isErr) return false
    this.error = ''
    return true
  }

  // validateError(){
  //   let isErr = false
  //   this.dataCopy[this.dataCopy.type].forEach(element => {
  //     if(!element.bg && (!['top','bottom'].includes(this.dataCopy.type))){
  //       isErr = true
  //       this.error = 'Please select fill color to continue'
  //     }
  //     if(!element.label && (!['top','bottom'].includes(this.dataCopy.type))){
  //       isErr = true
  //       this.error = 'Please enter label to continue'
  //     }
  //     if (this.valueType == 'percentage'){
  //       if(!element.pervalue && element.pervalue!==0){
  //         isErr = true
  //         this.error = 'Please enter value to continue'
  //       }
  //       if(!element.pervalue2 && this.dataCopy.type=='between' && element.pervalue2!=0){
  //         isErr = true
  //         this.error = 'Please enter values to continue'
  //       }
  //     }else{
  //       if(!element.value && element.value!==0){
  //         isErr = true
  //         this.error = 'Please enter value to continue'
  //       }
  //       if(!element.value2 && this.dataCopy.type=='between' && element.value2!=0){
  //         isErr = true
  //         this.error = 'Please enter values to continue'
  //       }
  //     }
  //   });
  //   if (isErr) return false
  //   this.error = ''
  //   return true
  // }

  pickColor(color:any,type:any,index:any){
    this.dataCopy[this.dataCopy.type][index][type] = color
    this.validateError()
  }
  
  addValue(){
    if(['top','bottom'].includes(this.dataCopy.type)){
      this.dataCopy[this.dataCopy.type].push({
        // value:'',
        // value2:'',
        value:null,
        value2:null,
        label:'',
        pervalue:null,
        pervalue2:null
      }) 
      this.dataCopy[this.dataCopy.type] = this.dataCopy[this.dataCopy.type].map((d:any,i:any)=>{
        return{...d}
      })
    }else{
      this.dataCopy[this.dataCopy.type].push({
        index:this.dataCopy[this.dataCopy.type].length,
        // value:'',
        // value2:'',
        value:null,
        value2:null,
        label:'',
        pervalue:null,
        pervalue2:null
      }) 
      this.dataCopy[this.dataCopy.type] = this.dataCopy[this.dataCopy.type].map((d:any,i:any)=>{
        return{...d,index:i}
      })
    }
    this.validateError()
  }
  removeIndex(index:any){
    this.dataCopy[this.dataCopy.type].splice(index, 1);
    this.dataCopy[this.dataCopy.type] = this.dataCopy[this.dataCopy.type].map((d:any,i:any)=>{
      return{...d,index:i}
    })
    this.validateError()
  }
}