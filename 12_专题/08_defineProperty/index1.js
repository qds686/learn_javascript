class Compute {
  plus(a, b) {
    return a + b;
  }

  minus(a, b) {
    return a - b;
  }

  mul(a, b) {
    return a * b;
  }

  div(a, b) {
    return a / b;
  }
}

class Claculator extends Compute {
  constructor(doc) {
    super();
    const oCal = doc.getElementsByClassName('J_calculator')[0];

    // 获取input
    this.fInput = oCal.getElementsByTagName('input')[0];
    this.sInput = oCal.getElementsByTagName('input')[1];

    // 做事件代理
    this.oBtnGroup = oCal.getElementsByClassName('btn-group')[0];
    // 获取下标使用
    this.oBtnItems = this.oBtnGroup.getElementsByTagName('button');
    // 计算值
    this.oResult = oCal.getElementsByClassName('result')[0];

    // 希望的数据格式是：
    /* this.data = {
      fNumber: xxx,
      sNumber: xxx,
      field: xxx
    } */
    this.data = this.defineData();
    // 切换初始值为0
    this.btnIdx = 0;
    console.log(this)
  }

  init() {
    this.bindEvent();
  }

  bindEvent() {
    this.oBtnGroup.addEventListener('click', this.onFieldBtnClick.bind(this), false);
    this.fInput.addEventListener('input', this.onNumberInput.bind(this), false);
    this.sInput.addEventListener('input', this.onNumberInput.bind(this), false);
  }

  // 对3个数据进行劫持
  defineData() {
    let _obj = {},
      fNumber = 0,
      sNumber = 0,
      field = 'plus';
    const _self = this;

    Object.defineProperties(_obj, {
      fNumber: {
        get() {
          console.log(`"fNumber" is being got.`);
          return fNumber;
        },
        set(newVal) {
          fNumber = newVal;
          _self.computerResult(fNumber, sNumber, field);
          console.log(`The value "fNumber" has been changed.[${fNumber}]`);
        }
      },
      sNumber: {
        get() {
          console.log(`"sNumber" is being got.`);
          return sNumber;
        },
        set(newVal) {
          sNumber = newVal;
          _self.computerResult(fNumber, sNumber, field);
          console.log(`The value "sNumber" has been changed.[${sNumber}]`);
        }
      },
      field: {
        get() {
          console.log(`"field" is being got.`);
          return field;
        },
        set(newVal) {
          field = newVal;
          _self.computerResult(fNumber, sNumber, field);
          console.log(`The value "field" has been changed.[${field}]`);
        }
      }
    });
    return _obj;
  }

  // 点击field按钮做事件代理
  onFieldBtnClick(ev) {
    const e = ev || window.event,
      tar = e.target || e.srcElement,
      tagName = tar.tagName.toLowerCase();

    tagName === 'button' && this.fieldUpdate(tar);
  }

  // 点击field实现切换，并且改变field值
  fieldUpdate(target) {
    this.oBtnItems[this.btnIdx].className = '';
    this.btnIdx = [].indexOf.call(this.oBtnItems, target);
    target.className += ' current';
    this.data.field = target.getAttribute('data-field');
  }

  // 输入值之后改变data
  onNumberInput(ev) {
    const e = ev || window.event,
      tar = e.target || e.srcElement,
      className = tar.className,
      val = Number(tar.value.replace(/\s+/g, '')) || 0;

    switch (className) {
      case 'f-input':
        this.data.fNumber = val;
        break;
      case 's-input':
        this.data.sNumber = val;
        break;
      default:
        break;
    }
  }

  // 计算结果
  computerResult(fNumber, sNumber, field) {
    this.oResult.innerText = this[field](fNumber, sNumber);
  }
}

new Claculator(document).init();