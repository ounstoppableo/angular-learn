## angular入门学习

### 基本概念

#### 组件

组件包括三个模块：

- @Component装饰器，一个装饰器会带以下angular信息
  - HTML模板
  - CSS选择器
  - 一组可选的CSS样式
- HTML模板
- CSS文件

例如：

~~~js
import { Component } from '@angular/core'
@Component({
    //用于定义组件名称
    selector: 'hello-world',
	//html模板
    template: `
	<h2>Hello World</h2>
	`,
})
export class HelloWorldComponent{
    //内部代码用来写出组件的行为
}

//要使用此组件需要在模板中编写以下内容，也就是selector定义的名称
<hello-world></hello-world>
~~~

##### 数据引用

当然，像以上写法去定义html和style可能会比较麻烦，这时可以通过templateUrl属性去引入外部的html和style

例如：

~~~js
import { Component } from '@angular/core';

@Component ({
  selector: 'hello-world-interpolation',
  templateUrl: './hello-world-interpolation.component.html',
  styleUrl: './hello-world-interpolation.component.css'
})
export class HelloWorldInterpolationComponent {
    message = 'Hello, World!';
}
~~~

如果你想使用数据引用，你可以这样写：

~~~html
<!--hello-world-bindings.component.html文件中-->
<!-- 使用中括号的方式进行标签内数据引用 -->
<p
  [id]="sayHelloId"
  [style.color]="fontColor">
  You can set my color in the component!
</p>
<!-- 使用小括号的方式进行事件绑定 -->
<button
  type="button"
  [disabled]="canClick"
  (click)="sayMessage()">
  Trigger alert message
</button>

<!-- 文本内容依旧是使用{{}} -->
<p>
    {{message}}
</p>
~~~

~~~js
import { Component } from '@angular/core';
 
@Component ({
  selector: 'hello-world-bindings',
  templateUrl: './hello-world-bindings.component.html'
})
export class HelloWorldBindingsComponent {
  fontColor = 'blue';
  sayHelloId = 1;
  canClick = false;
  message = 'Hello, World';
 
  sayMessage() {
    alert(this.message);
  }
}
~~~

##### 常用指令

Angular 中最常用的指令是 `*ngIf` （条件判断）和 `*ngFor`（条件循环）

###### *ngIf的使用方式

~~~html
<!-- hello-world-ngif.component.html文件 -->
<h2>Hello World: ngIf!</h2>
 
<button type="button" (click)="onEditClick()">Make text editable!</button>
 
<div *ngIf="canEdit; else noEdit">
    <p>You can edit the following paragraph.</p>
</div>
 
<ng-template #noEdit>
    <p>The following paragraph is read only. Try clicking the button!</p>
</ng-template>
 
<p [contentEditable]="canEdit">{{ message }}</p>
~~~

~~~js
import { Component } from '@angular/core';
 
@Component({
  selector: 'hello-world-ngif',
  templateUrl: './hello-world-ngif.component.html'
})
export class HelloWorldNgIfComponent {
  message = "I'm read only!";
  canEdit = false;
 
  onEditClick() {
    this.canEdit = !this.canEdit;
    if (this.canEdit) {
      this.message = 'You can edit me!';
    } else {
      this.message = "I'm read only!";
    }
  }
}
~~~

##### 组件间传参

###### 父传子

> 通过@angular/core下的Input装饰器

~~~html
<!-- 我们可以通过以下方式进行传承 -->  
<app-product-alerts [product]="product">
</app-product-alerts>
~~~

~~~js
import { Component, Input } from '@angular/core';
import { Product } from '../products';

@Component({
  selector: 'app-product-alerts',
  templateUrl: './product-alerts.component.html',
  styleUrls: ['./product-alerts.component.css'],
})
//我们可以利用Input装饰器进行参数接收
export class ProductAlertsComponent {
  @Input() product: Product | undefined;
}
~~~

###### 子传父

> 通过自定义事件的方式进行子对父的传参

~~~js
import { Component, Input,Output,EventEmitter } from '@angular/core';
import { Product } from '../products';

@Component({
  selector: 'app-product-alerts',
  templateUrl: './product-alerts.component.html',
  styleUrls: ['./product-alerts.component.css'],
})
export class ProductAlertsComponent {
  @Input() product: Product | undefined;
    //我们利用Output装饰器接收一个外部传来的自定义事件
  @Output() notify = new EventEmitter()
}
~~~

~~~html
<!-- product-alerts.component.html文件 -->
<p *ngIf="product && product.price>700"> 
    <!-- 然后在添加点击事件，把回调加上 -->
  <button type="button" (click)="notify.emit()">Notify Me</button>
</p>
~~~

~~~html
<!-- product-list.component.html文件 -->
<!-- 我们在子组件标签上自定义事件 -->
<app-product-alerts [product]="product" (notify)="onNotify()">
</app-product-alerts>
~~~

~~~js
import { Component } from '@angular/core';

import { products } from '../products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = [...products];

  share() {
    window.alert('The product has been shared!');
  }
  //事件的回调
  onNotify(){
    window.alert('This is the notify which the price over 700 dollars ')
  }
}
~~~

##### 添加导航

> 利用@angular/router内的ActivatedRoute获取路由参数

我们可以在组件构造函数内传入一个私有属性：

~~~js
import { ActivatedRoute } from '@angular/router';
export class ProductDetailsComponent implements OnInit {

  product: Product | undefined;

  constructor(private route: ActivatedRoute) { }

}
~~~

然后通过生命周期钩子ngOnInit()初始化数据：

~~~js
ngOnInit() {
  // First get the product id from the current route.
  const routeParams = this.route.snapshot.paramMap;
  const productIdFromRoute = Number(routeParams.get('productId'));

  // Find the product that correspond with the id provided in route.
  this.product = products.find(product => product.id === productIdFromRoute);
}
~~~

然后在添加组件路由：

~~~js
//src/app/app.module.ts文件
@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: ProductListComponent },
      { path: 'products/:productId', component: ProductDetailsComponent },
    ])
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    ProductListComponent,
    ProductAlertsComponent,
    ProductDetailsComponent,
  ],
//src/app/product-list/product-list.component.html文件
//通过routerLink属性进行路由
 <a
   [routerLink]="['/products', product.id]">
   {{ product.name }}
 </a>
~~~

##### 管道

> 主要作用就是将某个值转换成可供视图显示用的输出值
>
> angular常用的管道：date、currency
>
> 如何使用管道：
>
> - 使用@pipe装饰器
>
> - HTML模板中使用’|‘
>
>   ~~~js
>   {{interpolated_value | pipe_name}}
>   ~~~
>
>   管道还能传递参数:
>
>   ~~~html
>   <p>The date is {{today | date:'fullDate'}}</p>
>   ~~~
>
>   

#### NgModule

> NgModule是angular的基本构造块，它为组件提供了编译上下文环境。比如声明了一些组件、引入了一些模块，从而使组件的定义更加集中、组件的使用更加方便管理
>
> NgModule又被称为根模块，是一个功能块的根

> NgModule是一个装饰器，它可以传入一个对象作为参数，对象的属性如下：
>
> - declaretions: 用于声明本根模块下的组件、指令、管道
> - exports: 用于导出本模块下的需要被歪脖导入的组件或模块
> - imports: 引入的需要在本模块使用的其他模块
> - providers: 用于定义服务，定义后的服务能在本模块下的任何组件使用
> - bootstrap: 应用的主视图，称为根组件。只有根模块才能设置bootstrap

#### service(服务)

> service主要是提供一些与数据处理有关的功能，使用的方式就是通过依赖注入添加到组件中，可以使代码更加模块化、高复用

#### 装饰器的作用

> 主要是进行对HTML模板和CSS样式的关联、对组件名字的定义

#### 指令

指令分为：

- 结构型指令：*ngFor、\*ngIf；即会改变dom树结构的指令

- 属性型指令：用于修改现有元素的外观或行为

  ~~~html
  <!-- ngModel为数据双向绑定指令 -->
  <input type="text" id="hero-name" [(ngModel)]="hero.name">
  ~~~

#### 依赖注入（DI）

依赖注入主要是angular提供的一个装饰器，用于声明typescript类的依赖项

依赖注入一般是和服务联合使用的

使用场景：对于与特定视图无关并希望跨组件共享的数据或逻辑

具体用法：

- 先创建***服务类***，服务类的定义通常是紧跟着“@injectable()”装饰器之后的，该装饰器提供的元数据可以让被装饰的服务***作为依赖被注入***到客户组件中

- 添加了注入装饰器之后，还需要***提供服务***才能使用服务，如何提供服务呢：

  - 可以通过@[Injectable](https://angular.cn/api/core/Injectable)()传参的方式

    ~~~js
    //专门用于注入到根模块中
    @Injectable({
     providedIn: 'root',
    })
    //这个基本上就是全局配置了，只要配置了这个，在哪都能使用，并且还自带tree-shake功能，即如果该服务没有被任何组件使用，则会自动删除
    ~~~

  - 或者是对特定的ngModule或component提供

    ~~~js
    @NgModule({
      providers: [
      BackendService,
      Logger
     ],
     …
    })
    //-----------------------
    @Component({
      selector:    'app-hero-list',
      templateUrl: './hero-list.component.html',
      providers:  [ HeroService ]
    })
    ~~~

#### 路由

路由主要的功能就是将浏览器输入url后的默认行为进行代替，使浏览器在输入url后渲染的是视图而不是页面

具体的使用：

- ~~~sh
  #利用脚手架创建一个拥有router的项目
  ng new routing-app --routing --defaults
  ~~~

- ~~~sh
  #我们假设添加一个组件，用于路由
  ng generate component first
  ~~~

- ~~~js
  //创建路由配置项
  import {Routes} from '@angular/router'
  import {FirstComponent} from './first'
  export const routes: Routes = [
    { path: 'first-component', component: FirstComponent },
  ];
  ~~~

- ~~~js
  //app-routing.module.ts文件
  //在该文件下添加路由
  import { NgModule } from '@angular/core';
  import { RouterModule } from '@angular/router'; // CLI imports router
  import {routes} from './routes'
  
  // configures NgModule imports and exports
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  ~~~

### 响应式编程

#### 组件的生命周期

angular的组件生命周期钩子按执行顺序排列依次是：

- ngOnChanges():当数据发生变动时触发
- ***ngOnInit():数据绑定完之后执行，只执行一次***
- ngDoCheck():紧跟在每次执行变更检测时的 `ngOnChanges()` 和 首次执行变更检测时的 `ngOnInit()` 后调用
- ngAfterContentInit():第一次ngDoCheck()调用之后调用，只调用一次
- ngAfterContentChecked():每次组件内容改变都会调用
- ***ngAfterViewInit():第一次渲染完页面调用，只调用一次***
- ***ngAfterViewChecked()：每次更新数据后渲染完页面时调用***
- ***ngOnDestroy():组件销毁时调用***

使用时组件的类需要实现生命周期:

~~~js
export class SpyDirective implements OnInit, OnDestroy {}
~~~

#### 可观察对象（Observable）

> 基于发布订阅模式

基本用法：（其实就是迭代器）
~~~ts
//定义一个观察者函数
function sequenceSubscriber(observer: Observer<number>) {
  // 给next()传值
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();

  //观察对象执行完毕，则停止订阅
  return {unsubscribe() {}};
}

//创建一个观察者对象
const sequence = new Observable(sequenceSubscriber);

// 进行订阅
sequence.subscribe({
  next(num) { console.log(num); },
  complete() { console.log('Finished sequence'); }
});

// Logs:
// 1
// 2
// 3
// Finished sequence
~~~

### 获取dom的三种方式

- 通过@viewChild装饰器获取dom

  ~~~js
  import {Component,ViewChild,ElementRef} from '@angular/core'
  @Component({
      selector: 'my-app',
      template:`
      <p #greet>Hello </p>
      `
  })
  export class AppComponent {
      @ViewChild('greet')
      greetDiv!:ElementRef
  }
  ~~~

- 通过ElementRef注入的方式获取(一般这种是获取根dom，然后进行querySelector)

  ~~~js
  import {ElementRef} from '@angular/core'
  export class AppComponent {
      constructor( private el:ElementRef ){
          
      }
  }
  ~~~

- 通过Renderer2获取

  ~~~js
  import {Renderer2} from '@angular/core'
  export class AppComponent {
      constructor( private renderer2:Renderer2 ){
          
      }
  }
  ~~~


### 杂项

#### standalone

> standalone是angular14推出的新功能，旨在减少NgModule的复杂性
>
> 以前我们要在组件中使用另一个组件、指令、pipe，都需要到根模块的imports属性引入，但是standalone摆脱了这个麻烦
>
> 它使组件也能够使用imports，这样我们的组件就可以不通过NgModule就实现互相引用了
>
> 使用方法是在@Component内加上standalone=true，这样组件就变成一个独立组件了

~~~js
import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [HomeComponent]
})
export class AppComponent {
  title = 'my-app';
}
~~~

> 注意一点：加了standalone属性的组件就不能在NgModule中declare了

> 实际上我们会把app.module.ts文件删除
>
> 然后在main.ts中修改成：
>
> ~~~js
> import { bootstrapApplication } from '@angular/platform-browser';
> import { AppComponent } from './app/app.component';
> bootstrapApplication(AppComponent).catch(err => console.error(err));
> ~~~
>
> app.component.ts会修改成：
> ~~~js
> import { Component } from '@angular/core';
> import { HomeComponent } from './home/home.component';
> import { CommonModule } from '@angular/common';
> 
> @Component({
>   selector: 'app-root',
>   styleUrls: ['./app.component.css'],
>   standalone: true,
>   imports: [HomeComponent,CommonModule],
>   template: `
>       <app-home></app-home>
> `,
> 
> })
> export class AppComponent {
>   title = 'my-app';
> }
> ~~~
>
> CommonModule的引入能帮助我们能够使用一些angular的内置组件，例如*ngIf，取代了之前NgModule中引入的BroswerModule

> 独立组件和原来的模块最大的不同就是，原来根模块引入的东西，在其模块下的任何组件、指令、pipe都可以直接使用引入的东西的功能
>
> 而独立组件需要用到的功能都需要通过自己去添加imports

#### form表单的使用

> - 引入以下模块、类
>
>   ~~~js
>   import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms'
>   ~~~
>
> - ReactiveFormsModule模块需要放入imports
>
> - FormGroup, FormControl用于定义表单数据，例子如下
>
>   ~~~js
>   const applyForm = new FormGroup({
>       firstName: new FormControl(),
>       lastName: new FormControl(),
>       email: new FormControl()
>     })
>   ~~~
>
> - 然后在html中使用：
>
>   ~~~html
>   <form [formGroup]="applyForm" (submit)="submitApplication()">
>         <label for="firstName">First Name</label>
>         <input type="text" id="firstName" formControlName="firstName">
>         <label for="lastName">Last Name</label>
>         <input type="text" id="lastName" formControlName="lastName">
>         <label for="email">Email</label>
>         <input type="text" id="email" formControlName="email">
>         <button type="submit" class="primary">Apply now</button>
>   </form>
>   ~~~
>
> - 使用FormGroup, FormControl的写法非常麻烦，我们可以使用FormBuilder来进行重构
>
>   ~~~js
>   import { FormBuilder } from '@angular/forms';
>   
>   export class A{
>       constructor(private fb: FormBuilder) { }
>   	applyForm = this.fb.group({
>           firstName: '',
>           lastName: '',
>           email: ''
>     })
>   }
>   ~~~
>
>   <font color="red">html模板照样适用</font>
>
> - 表单验证
>
>   需要引入如下组件
>
>   ~~~js
>   import { Validators } from '@angular/forms';
>   ~~~
>
>   并且将this.fb.group进行以下更改:
>
>   ~~~js
>   export class A{
>       constructor(private fb: FormBuilder) { }
>   	applyForm = this.fb.group({
>           firstName: ['',Validators.required],
>           lastName: ['',Validators.required],
>           email: ['',Validators.required]
>     })
>   }
>   //FormControl的写法
>   firstName: new FormControl(this.applyForm.firstName, Validators.required)
>   //定义多个验证器
>   firstName: new FormControl(this.hero.name, [
>         Validators.required,
>         Validators.minLength(4),
>         forbiddenNameValidator(/bob/i)
>       ]),
>   ~~~
>
>   添加了Validators.required属性之后，验证的结果会通过FormGroup实例的status属性(在这个例子中是this.applyForm.status)反馈出来
>
>   以上我们使用的都是内置的验证器Validators，如何自定义一个自己的验证器呢？
>
>   ~~~js
>   //我们创建一个文件用于存放验证器
>   //myValidator.ts文件
>   //参数是一个正则
>   export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
>       //返回一个函数，该函数会被自动执行，传入添加该验证器的表单属性的值control
>     return (control: AbstractControl): ValidationErrors | null => {
>         //验证逻辑
>       const forbidden = nameRe.test(control.value);
>       return forbidden ? {forbiddenName: {value: control.value}} : null;
>     };
>   }
>   ~~~
>
>   ~~~js
>   firstName = new FormControl(this.applyForm.firstName, forbiddenNameValidator(/bob/i))
>   ~~~
>
>   ***表单验证之跟踪校验***
>
>   我们在使用以上方法进行表单校验时，常常会跟踪不到表单的实时变化
>
>   这时可以尝试在独立控件模式下使用 ngModel（在html内通过#引入ngModel方法）
>
>   ~~~html
>   <!-- 这里我们定义了#ctrl="ngModel",就可以通过ctrl拿到各种表单状态，比如ctrl.valid拿到通过状态 -->
>   <input [(ngModel)]="name" #ctrl="ngModel" required>
>   
>       <p>Value: {{ name }}</p>
>       <p>Valid: {{ ctrl.valid }}</p>
>   
>   <button (click)="setValue()">Set value</button>
>   ~~~
>
>   对form表单使用：
>   ~~~html
>   <!-- 你可以通过f进行全局判断,f.value={first: '',last: ''},你甚至可以通过事件传递到ts文件中,比如onSubmit(f) -->
>   <form #f="ngForm" (ngSubmit)="onSubmit(f)" novalidate>
>         <input name="first" ngModel required #first="ngModel">
>         <input name="last" ngModel>
>         <button>Submit</button>
>   </form>
>   ~~~