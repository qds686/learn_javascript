class Subject {
  // 存放所有观察者的容器
  observerList = [];

  // 校验观察者模式
  checkObserver(observer) {
    if (observer !== null && /^(object|function)$/.test(typeof observer)) {
      if (typeof observer.update === "function") {
        return true;
      }
    }
    throw new TypeError("Illegal observer");
  }

  add(observer) {
    this.checkObserver(observer);
    let { observerList } = this;
    if (observerList.includes(observer)) return;
    observerList.push(observer);
  }
  remove(observer) {
    this.checkObserver(observer);
    let { observerList } = this;
    this.observerList = observerList.map(item => {
      if (item === observer) {
        return null;
      }
      return item;
    });
  }
  notify(...params) {
    let { observerList } = this;
    for (let i = 0; i < observerList.length; i++) {
      let item = observerList[i];
      if (item === null) {
        // splice可以改变原始数组
        observerList.splice(i, 1);
        i--;
        continue;
      }
      item.update(...params);
    }
  }
}

// 定义多个观察者
let observer1 = {
  update(...params) {
    console.log('我是观察者1', params);
  }
};

class Observer {
  update(...params) {
    console.log('我是观察者2', params);
  }
}

const sub = new Subject;
sub.add(observer1);
sub.add(new Observer);

setTimeout(() => {
  // 我是观察者1 [100, 200]
  // 我是观察者2 [100, 200]
  sub.notify(100, 200);
}, 2000);