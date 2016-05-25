import {Component, Input, Output,NgZone} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, RouteSegment} from '@angular/router';
import {Http, Response, HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Jsonp, URLSearchParams, JSONP_PROVIDERS } from '@angular/http';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from '@angular/common';
import * as moment from 'moment';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';

import {baseUrl} from '../../../services/config';
import { BaccaratService } from '../../../services/Baccarat.service';
import {Validators} from '../../../services/Validators';

const URL = baseUrl+'/medias/uploadBackgroundImage';

@Component({
    selector: 'baccarat-add',
    templateUrl: 'reward/controllers/baccarat/add/template.html',
    styleUrls: ['reward/controllers/baccarat/add/style.min.css'],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES,UPLOAD_DIRECTIVES],
    providers: [BaccaratService, HTTP_PROVIDERS, JSONP_PROVIDERS],
})

export class BaccaratAddComponent {
  zone: NgZone;
    bsForm: ControlGroup;
    subForm: ControlGroup;
    baccarat: any;
    errorMessage: any;
    id: number;

    uploadedFiles: any[] = [];
    options: Object = {
        url: URL
    };
    basicProgress: number = 0;
    basicResp: Object;
    uploadFile: any;
    constructor(private ps: BaccaratService, private router: Router, fb: FormBuilder, params: RouteSegment) {
      this.zone = new NgZone({ enableLongStackTrace: false });
      this.id = +params.getParam('id');
        this.subForm = fb.group({
            'cRPDName': ['', Validators.required],
            'cRPDSubtitle': [''],
            'cRPDNum': [''],
            'cRPBackgroundShow': [0],
            'cRPDBackgroundAdd': [''],
        });
        this.bsForm = fb.group({
            'cRPName': ['', Validators.required],
            'cRPSubtitle': [''],
            'cRPNameShow': [1],
            'cRPSubtitleShow': [0],
            'cRPBackgroundAdd': [''],
            'cRPBackgroundShow': [0],
            'cRPExchangeType': [1],
            'cRPDesc': [''],
            'cRPDescShow': [0],
            'cRPValidDate': [moment().format('YYYY-MM-DD') + '-' + moment().format('YYYY-MM-DD')],
            'cRPValidStartDate': [moment().format('YYYY-MM-DD')],
            'cRPValidEndDate': [moment().format('YYYY-MM-DD')],
            'cRPValidType': [-1],
            'cRPRate': [1],
            'cRPRateContent': ['', Validators.ratio],
            'totalRewards': [''],
            'cRPCodeType': [1],
            'cRPCodeCommon': [''],
            'cRPGenerateType': [1],
            'fileName': [''],
            'cRPNoticeNow': [1],
            'cRPNoticeNowContent': ['奖励领取验证码888888，恭喜您获得由{品牌名}提供的的{奖品名称}一份，有效期{生效日期}至{失效日期}。'],
            'cRPValidNotice': [1],
            'cRPValidNoticeDay': [3],
            'cRPValidNoticeContent': ['奖励领取验证码888888，您获得的由{品牌名}提供的的{奖品名称}将在{失效日}到期，请及时兑换。'],
        });

    }

    ngOnInit() {
        this.baccarat = {};
        this.baccarat.cRPValidDate = moment().format('YYYY-MM-DD') + '-' + moment().format('YYYY-MM-DD');
        this.baccarat.cRPExchangeType = 2;
        this.baccarat.cRPValidType = -1;
        this.baccarat.cRPRate = 1;
        this.baccarat.cRPCodeType = 1;
        this.baccarat.cRPGenerateType = 1;
        this.baccarat.cRPValidNoticeDay = 3;
        this.baccarat.cRPNoticeNowContent = '奖励领取验证码888888，恭喜您获得由{品牌名}提供的的{奖品名称}一份，有效期{生效日期}至{失效日期}'
        this.baccarat.cRPValidNoticeContent = '奖励领取验证码888888，您获得的由{品牌名}提供的的{奖品名称}将在{失效日}到期，请及时兑换。'
        this.baccarat.subInfo = [{},{},{}];

        this.getPinProgram();
    }

    handleBasicUpload(data,index): void {
        let sb = this.baccarat.subInfo[index];
        if (data && data.response) {
          sb.uploadFile = JSON.parse(data.response);
          sb.cRPBackgroundAdd = sb.uploadFile.data;
        }
        sb.basicResp = data;
        this.zone.run(() => {
            sb.basicProgress = data.progress.percent;
        });
    }

    getPinProgram() {
        if (this.id === undefined || isNaN(this.id)) return;
        this.ps.getOne(this.id).subscribe(data => this.setPsForm(data));
    }

    setPsForm(data) {
        this.baccarat = data.data;
    }

    onSubmit() {
        if (!this.bsForm.valid) {
            this.bsForm.markAsTouched();
            return false;
        }
        this.ps.add(this.baccarat).subscribe(data => {
            if (data.error.state !== 0) {
                alert(data.error.msg);
                return;
            }
            alert('成功');
            this.toHome();
        },
            error => { this.errorMessage = <any>error; alert(error) });
    }

    onAddSubInfo(){
      if(this.baccarat.subInfo.length>7){
        return;
      }
      this.baccarat.subInfo.push({});
    }

    toHome() {
        this.router.navigate(['/']);
    }
    goBack() {
        window.history.back();
    }
}