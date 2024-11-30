import { Component, Inject, ViewChild, Renderer2 } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef} from '@angular/material/legacy-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { SentimentsService } from '@lib/umwelt-lib';
import * as FileSaver from 'file-saver';
// import jsPDF from 'jspdf';

const COLUMNS_SCHEMA = [
    {
        key: 'Entities',
        type: 'string',
        label: 'Word',
    },
    {
        key: 'Comment',
        type: 'string',
        label: 'Score',
    },
    {
        key: 'Size',
        type: 'number',
        label: 'Size',
    },
    {
        key: 'Color',
        type: 'color',
        label: 'Color',
    },
];

@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudComponent {
    public myForm: FormGroup;
    public intentWords = [];
    public currentStep = 0;
    public selectedIntentWords = [];

    @ViewChild('stepper', {static: false}) stepper: MatStepper;

    dataSource;
    columnsSchema: any = COLUMNS_SCHEMA;
    displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
    imageData: any;
    imageBlob: any;
    isloading: boolean = false;

    fonts = [
        'STIXGeneral',
        'Didot',
        'Apple Braille',
        'Farisi',
        'Times New Roman',
        'Rockwell',
        'Georgia',
        'Telugu MN',
        'Symbol',
        'Andale Mono',
        'Tahoma',
        'Impact',
        'Geneva',
        'Gujarati Sangam MN',
        'Sana',
        'Galvji',
        'Wingdings 2',
        'Diwan Thuluth',
        'Raanana',
        'Lao MN',
        'Skia',
        'Courier New',
        'Avenir Next',
        'Herculanum',
        'Tahoma',
        'Noteworthy',
        'Helvetica',
        'Verdana',
        'Courier',
        'Webdings',
        'Ayuthaya',
        'Trattatello',
        'Menlo',
        'Wingdings',
        'AppleMyungjo',
        'SignPainter',
        'Krungthep',
        'Arial',
        'Cochin',
        'Monaco',
        'Tamil MN',
        'Kannada MN',
        'Al Nile',
        'Trebuchet MS',
        'Bangla Sangam MN',
        'Al Tarikh',
        'Microsoft Sans Serif',
        'Avenir',
        'Apple Braille',
        'Kailasa',
        'Verdana',
        'Malayalam Sangam MN',
        'Chalkduster',
        'Kefa',
        'Savoye LET',
        'Myanmar MN',
        'Trebuchet MS',
        'KufiStandardGK',
        'Papyrus',
        'Trebuchet MS',
        'Palatino',
        'Malayalam MN',
        'Baskerville',
        'Apple Braille',
        'Diwan Kufi',
        'Courier New',
        'Comic Sans MS',
        'Gurmukhi Sangam MN',
        'Trebuchet MS',
        'Hoefler Text',
        'Hoefler Text',
        'Verdana',
        'STIXGeneral',
        'Bodoni 72',
        'Tamil Sangam MN',
        'Courier New',
        'Beirut',
        'Mishafi Gold',
        'Wingdings 3',
        'Arial Narrow',
        'Georgia',
        'Arial Black',
        'Sathu',
        'AppleGothic',
        'Bangla MN',
        'Baghdad',
        'Apple Braille',
        'STIXGeneral',
        'Times',
        'Damascus',
        'Luminari',
        'Oriya Sangam MN',
        'Sinhala Sangam MN',
        'Waseem',
        'Gurmukhi MN',
        'Athelas',
        'Mshtakan',
        'Apple Symbols',
        'Myanmar Sangam MN',
        'Phosphate',
        'Kannada Sangam MN',
        'Nadeem',
        'Silom',
        'Copperplate',
        'Mishafi',
        'Iowan Old Style',
        'Marion',
        'Times New Roman',
        'Futura',
        'Courier New',
        'Thonburi',
        'Lao Sangam MN',
        'Optima',
        'Khmer MN',
        'Oriya MN',
        'Hiragino Sans GB',
        'Muna',
        'Georgia',
        'Apple Braille',
        'Kokonor',
        'Khmer Sangam MN',
        'Zapfino',
        'Sinhala MN',
        'STIXGeneral',
        'Devanagari Sangam MN',
        'Times New Roman',
        'Verdana',
        'Seravek',
        'Comic Sans MS',
        'Telugu Sangam MN',
        'Georgia',
        'Apple Chancery',
        'STIXGeneral',
        'Times New Roman',
        'Avenir Next Condensed',
        'Bodoni Ornaments',
        'Chalkboard',
        'Farah',
        'Charter'
    ]

    searchTextFont = '';

    enteredButton = false;
    isMatMenuOpen = false;
    isMatMenu2Open = false;
    prevButtonTrigger;

    constructor(@Inject(MAT_LEGACY_DIALOG_DATA) public data: any,
    public dialogRef: MatLegacyDialogRef<WordCloudComponent>,
    private _formBuilder: FormBuilder,
    private commentService: SentimentsService,
    private ren: Renderer2){
        if (this.data){
            this.intentWords = data
        }
    }

    ngOnInit() {
        this.sortFonts()
        this.myForm = this._formBuilder.group({
            Option: ['default', [Validators.required]],
            Words: [10, [Validators.required, Validators.min(10), Validators.max(20)]],
            Font: ['Arial', Validators.required],
        });
    }

    getStep1Validation(){
        return (
            this.myForm.controls['Option'].status == 'VALID' && this.myForm.controls['Words'].status == 'VALID'
        )
    }

    sortFonts() {
        const uniqueFonts = [...new Set(this.fonts)]; // Remove duplicates and convert to an array
        uniqueFonts.sort((a, b) => a.localeCompare(b)); // Sort the unique fonts
        this.fonts = uniqueFonts; // Update the fonts array with the sorted, unique fonts
    }

    defaultWordCloud() {

        const n = this.myForm.get('Words').value;
        this.selectedIntentWords = this.intentWords.slice(0, n);
      
        // Calculate the size value
        const groupSize = Math.ceil(this.selectedIntentWords.length / 2);
        for (let i = 0; i < this.selectedIntentWords.length; i++) {
            this.selectedIntentWords[i].Size = groupSize - i % groupSize;
        }
      
        // Add color and emotion values based on the 'score' key
        this.selectedIntentWords.forEach((word) => {
          if (word.Score == 1) {
            word.Color = '#72A230';
            word.Comment = 'Positive';
          } else if (word.Score == 2) {
            word.Color = '#FFAF40';
            word.Comment = 'Neutral';
          } else {
            word.Color = '#ff4d4d';
            word.Comment = 'Negative';
          }
        });

        console.log(this.selectedIntentWords);
    }

    checkOptionValue(){
        this.defaultWordCloud()

        if (this.myForm.controls['Option'].value == 'default'){
            this.showWordCloud()
        }
        else{
            this.stepper.selectedIndex = 1;
            this.dataSource = this.selectedIntentWords
        }
    }

    showWordCloud() {
        this.stepper.selectedIndex = 2;
        this.isloading = true
      
        let param = {'data': this.selectedIntentWords, 'font': "Garamond"};
        this.commentService.exportWordCloud(param).subscribe(
          (imageBlob: Blob) => {
            this.isloading = false
            this.imageBlob = imageBlob
            const reader = new FileReader();
            reader.onload = (event) => {
              this.imageData = reader.result as string; // Cast event.target to FileReader
            };
            reader.readAsDataURL(imageBlob);
          }
        );
    }
      
    onCustomize(){
        this.showWordCloud()
    }

    previousFromWordCloud(){
        if (this.myForm.controls['Option'].value == 'default'){
            this.stepper.selectedIndex = 0;
        }else{
            this.stepper.selectedIndex = 1;
        }
    }

    
  close(){
    this.dialogRef.close();
  }

  saveFile(blob: Blob, fileName: string) {
    FileSaver.saveAs(blob, fileName);
  }

    //on hover show mat-menu code

    menuEnter() {
        this.isMatMenuOpen = true;
        if (this.isMatMenu2Open) {
            this.isMatMenu2Open = false;
        }
    }

    menuLeave(trigger, button) {
        setTimeout(() => {
            if (!this.isMatMenu2Open && !this.enteredButton) {
            this.isMatMenuOpen = false;
            trigger.closeMenu();
            this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
            this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
            } else {
            this.isMatMenuOpen = false;
            }
        }, 80)
    }

    buttonEnter(trigger) {
        setTimeout(() => {
            if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
            this.prevButtonTrigger.closeMenu();
            this.prevButtonTrigger = trigger;
            this.isMatMenuOpen = false;
            this.isMatMenu2Open = false;
            trigger.openMenu();
            this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
            this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
            }
            else if (!this.isMatMenuOpen) {
            this.enteredButton = true;
            this.prevButtonTrigger = trigger
            trigger.openMenu();
            this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
            this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
            }
            else {
            this.enteredButton = true;
            this.prevButtonTrigger = trigger
            }
        })
    }

    buttonLeave(trigger, button) {
        setTimeout(() => {
            if (this.enteredButton && !this.isMatMenuOpen) {
            trigger.closeMenu();
            this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
            this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
            } if (!this.isMatMenuOpen) {
            trigger.closeMenu();
            this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
            this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
            } else {
            this.enteredButton = false;
            }
        }, 100)
    }

    //on hover show mat-menu code

    download(type){
        if (type == 'image'){
            this.saveFile(this.imageBlob, 'wordcloud.png');
        }
        else {
            // const contentDataURL = this.imageData
            // let pdf = new jsPDF('p', 'mm', 'a4');
            // var position = 0;
            // const imgProps= pdf.getImageProperties(this.imageData);
            // const pdfWidth = pdf.internal.pageSize.getWidth();
            // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            // pdf.addImage(contentDataURL,'PNG',0,position,pdfWidth, pdfHeight)
            // pdf.save('wordcloud.pdf');
        }
    }

    changeInput(value){
        if(value.data == null){
            this.searchTextFont = this.searchTextFont.slice(0, this.searchTextFont.length - 1)
        }
        else{
          this.searchTextFont = this.searchTextFont+value.data
        }
    }
}