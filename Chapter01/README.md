# Refactoring

# 1.1 리팩터링 맛보기 예시

```jsx
function statement(invoice, pays){
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명  ${invoice.customer})\n`

    // Intl : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl 각 언어에 맞게 비교 기능.
    const format = new Intl.NumberFormat("en-US", {
        style : "currency", currency: "USD", minimumFractionDigits: 2
    }).format;
    
    for(let perf of invoice.performances){
        const play = plays[perf.playID];
        let thisAmount = 0;

        switch (play.type){
            case "tragedy":
                thisAmount = 40000;
                if(perf.audience > 30){
                    thisAmount += 1000 * (perf.audienc -30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if(perf.audience > 20){
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300* perf.audience;
                break;
            default:
                throw new Error('알 수 없는 장르 : ${play.type}');
        }

        // 포인트 적립 및 추가 포인트 적립.
        volumeCredits += Math.max(perf.audience - 30, 0);
        if("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        result += `${play.name} : ${format(thisAmount/100)} (${perf.audience}석)\n`;
        totalAmount += thisAmount;
    }

    result += `총액 : ${format(totalAmount/100)}`;
    result += `적립 : ${volumeCredits}점\n`;

    return result;
}
```

![Refactoring%20f8fd8e2708264079aee412979b230773/Untitled.png](Refactoring%20f8fd8e2708264079aee412979b230773/Untitled.png)

해당 예시 코드를 보면서 리팩터링 해야할 부분이 뭐가 있을까? 생각 해보았을 때 바로 든 생각 : 
switch문에서 문자열 2가지 (tragedy, comedy)만 처리 하고 있으니까, 장르가 늘어난다면 수동적인 추가를 해주어야 할 것이다.

## 프로그램이 새로운 기능을 추가하기에 편한 구조가 아니라면, 먼저 기능을 추가하기 쉬운 형태로 리팩터링하고 나서 원하는 기능을 추가한다.

저자가 말하는 리팩터링 해야할 부분 : 

1. 청구 내역을 HTML로 출력하는 기능이 필요.
2. **더 많은 장르의 연극을 원할 때 공연료, 포인트에 영향을 미칠 것.**

### statement() 함수 쪼개기.

가장 눈에 띄눈 문제 : switch()
이 부분을 쪼갠다. statement() 안에 있었지만, '함수 추출하기'를 통해 amountFor() 함수로 분리한다.

즉, amountFor() 함수는 statement() 안에 있고, perf, play변수를 매개변수로 사용하는 중첩 함수로 사용된다.

```jsx
function amountFor(perf, play){
    switch (play.type){
        case "tragedy":
            thisAmount = 40000;
            if(perf.audience > 30){
                thisAmount += 1000 * (perf.audienc -30);
            }
            break;
        case "comedy":
            thisAmount = 30000;
            if(perf.audience > 20){
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300* perf.audience;
            break;
        default:
            throw new Error('알 수 없는 장르 : ${play.type}');
    }
    return thisAmount;
}
function statement(invoice, plays){
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명  ${invoice.customer})\n`

    // Intl : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl 각 언어에 맞게 비교 기능.
    const format = new Intl.NumberFormat("en-US", {
        style : "currency", currency: "USD", minimumFractionDigits: 2
    }).format;
    
    for(let perf of invoice.performances){
        const play = plays[perf.playID];
        
        // let thisAmount = 0;   --> 함수 호출로 변경.
        let thisAmount = amountFor(perf, play);
        // switch 문이 있던 자리.

        // 포인트 적립 및 추가 포인트 적립.
        volumeCredits += Math.max(perf.audience - 30, 0);
        if("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        result += `${play.name} : ${format(thisAmount/100)} (${perf.audience}석)\n`;
        totalAmount += thisAmount;
    }

    result += `총액 : ${format(totalAmount/100)}`;
    result += `적립 : ${volumeCredits}점\n`;

    return result;
}

const invoices = require('./invoices.json'); 
const plays = require('./plays.json');

console.log(statement(invoices[0], plays));
```

![Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%201.png](Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%201.png)

### 변수명 설정하기.

저자는 함수의 반환값은 무조건 result로 한다고 한다. → result만 따라가면 함수의 반환역할은 확실히 알 수 있다.

> 좋은 코드라면 하는일이 명확히 드러나야 한다.

→ 이름이 가장 가치가 있다.

위 예시 코드에서 저자의 입맛대로 변수를 바꿔본다.
thisAmount → result
perf→ aPerformance  // 하는 일이 명확하지 않을 때 (a/an) 부정 관사를 자주 사용한다.

### 다른 함수에서 변하지 않는 값 제거 하기.

play 변수는 amount 함수 내에서 Rvalue의 역할만 한다. 변하지 않는다.

```jsx
function playFor(aPerformance){  // plays 를 사용하기 위해 statement의 내장함수.
    return plays[aPerformance.playID];
}

const play = playFor(perf);
```

### 변수 인라인 하기.

play는 playFor(perf)를 통해 O(1)만에 할당.

이 play를 amountFor()의 매개변수로 인라인화.

**예시의 < statement > 내에서  총 3군데서나 인라인화 할 수 있음.**

```jsx
let thisAmount = amountFor(perf, playFor(perf));
...

if("comedy" === **playFor(aPerformance)**.type) volumeCredits += Math.floor(aPerformance.audience / 5);...
...

result += `${**playFor(aPerformance)**.name} : ${format(thisAmount/100)} (${aPerformance.audience}석)\n`;
```

**< statement 내부함수인 amountFor() 에서도 인라인화 >**

```jsx
function amountFor(aPerformance){ // play는 변하지 않는다. 제거 가능.
    let result = 0;
    
    switch (playFor(aPerformance).type){
        case "tragedy":
            result = 40000;
            if(aPerformance.audience > 30){
                result += 1000 * (aPerformance.audience -30);
            }
            break;
        case "comedy":
            result = 30000;
            if(aPerformance.audience > 20){
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300* aPerformance.audience;
            break;
        default:
            throw new Error(`알 수 없는 장르 : ${**playFor(aPerformance)**.type}`);
    }
    return result;
}
```

![Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%202.png](Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%202.png)

매개변수로 받던 play가 사라졌다.

**< thisAmount 변수 → amountFor() 를 통한 인라인화. >**

```jsx
for(let aPerformance of invoice.performances){
    // 포인트 적립 및 추가 포인트 적립.
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
    
    if("comedy" === playFor(aPerformance).type) volumeCredits += Math.floor(aPerformance.audience / 5);
    result += `${playFor(aPerformance).name} : ${format(**amountFor(aPerformance)**/100)} (${aPerformance.audience}석)\n`;
    totalAmount += **amountFor(aPerformance)**;
}
```

### volumeCredits 함수 추출하기.

적립 포인트 계산을 하는 volumeCredits 함수를 만든다.

<기존>

```jsx
volumeCredits += Math.max(aPerformance.audience - 30, 0);

if("comedy" === playFor(perf).type)
	 volumeCredits += Math.floor(perf.audience / 5);
result += `${playFor(perf).name} : ${format(amountFor(perf)/100)} (${Z.audience}석)\n`;
totalAmount += amountFor(perf);
```

<수정>

```jsx
function volumeCreditsFor(aPerformance){
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
    if("comedy" === playFor(aPerformance).type)
        volumeCredits += Math.max(aPerformance.audience / 5);
    return volumeCredits;
}
```

### format 변수 제거하기.

> 임시변수는 문제를 일으킬 수 있다.
자신이 속한 루틴에서만 의미가 있어서 길고 복잡해 질 수 있다.

⇒ 함수로 빼준다.

```jsx
function format(aNumber){
    return new Intl.NumberFormat("en-US", {
        style : "currency", currency: "USD", minimumFractionDigits: 2
    }).format(aNumber);
}
```

임시 변수 였는데 함수로 다 대체가 된다.

- `format(amountFor(perf)`
- `format(totalAmount/100)`

But, format이 뜻하는 것으로 함수의 의미를 설명해주지 못한다.  라고 저자는 생각한다.

1. formatAsUSD 로 바꾸기.  // 너무 길고 장황하다.
2. **함수 선언 바꾸기.**

### 함수 선언 바꾸기.

```jsx
function usd(aNumber){
    return new Intl.NumberFormat("en-US", {
        style : "currency", currency: "USD", minimumFractionDigits: 2
    }).format(aNumber/100);
}
```

함수이름을 usd로 바꿨는데, 1.번 방법 2.번 방법 뭐가 다른걸까? ToDo : 6.5절 함수 선언 바꾸기.

- usd로 바꾸면서 이름을 명확히 했다.
- /100을 하는 것도 함수 안에 포함시켰다.

### 반복문 쪼개기 (volumeCredits 변수 제거하기.) 8.7절

```jsx
for(let perf of invoice.performances){
    volumeCredits += volumeCreditsFor(perf);    
    ...
}
```

반복문 1번 돌 때마다 계속해서 누적되고 있는 volumeCredits 변수.

반복문에서 값 누적 로직(volumeCredits)만 따로 분리해서 뽑아낸다.

```jsx
for(let perf of invoice.performances){
    volumeCredits += volumeCreditsFor(perf);
    
    result += `${playFor(perf).name} : ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
}
```

```jsx
for(let perf of invoice.performances){    
    result += `${playFor(perf).name} : ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
}
for(let perf of invoice.performances){    
    volumeCredits += volumeCreditsFor(perf);
}
```

### 문장 슬라이드 하기. 8.6절

```jsx
for(let perf of invoice.performances){    
    result += `${playFor(perf).name} : ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
}
let volumeCredits = 0;    //  <--- 선언을 반복문 바로 앞으로 옮긴다.
for(let perf of invoice.performances){    
    volumeCredits += volumeCreditsFor(perf);
}
```

### 함수 추출하기.

값 누적 로직을 전부 함수로 바꿔준다.

```jsx
function totalVolumeCredits() {
		let volumeCredits = 0;
		for(let perf of invoide.performances){
		    volumeCredits += volumeCreditsFor(perf);
		}
		return volumeCredits;
}

let volumeCredits = totalVolumeCredits();
```

### 또 다시 인라인 하기 반복.

volumeCredits 가 삭제되고,
totalVolumeCredits(); 으로 대체.

### 결과

4가지의 과정을 통해 반복문을 쪼개고, 문장을 슬라이드 하고, 함수를 추출해서, 변수를 없애고 인라인화를 했다.

반복문이 늘어나면 성능이 저하되지 않을까?

**→ 아주 작은 부분이기 때문에 성능 저하가 미미하다고 주장한다.**

**→ 최신 컴파일러들은 최신 캐싱 기법으로 결과를 더 좋게 내준다.**

**→ 무엇보다 깔끔하게 보기 좋아야 결과적으로 빠르고 깔끔해 보인다고 한다.**

### totalAmount 변수도 없애주기 위해 위 방법을 반복한다.

## 1단계 튜토리얼 중간 결과

→ 주요 함수 statement(invoic, plays){} 에는 7줄의 코드가 남게 되었고,
그 아래 내부 함수들 6개가 생기게 되었다.

## 원래 목표 : HTML 출력 기능 추가하기.

### 문제점 :

- statement() 안에 6개의 중첩 함수들.
- "이 모두를 그대로 복사해 붙이는 방식으로 HTML 버전을 만들고 싶진 않다.
텍스트 버전과 HTML 버전 함수 모두가 똑같은 계산 함수들을 사용하게 만들고 싶다."

    ??? : 이게 무슨 말?

### 단계 쪼개기

1. statement() 에서 필요한 데이터를 처리.
2. 결과를 Text or HTML로 표현.

### 함수 추출하기

를 이용하여 1단계, 2단계 2개의 함수로 나눠준다.

그 중간에서 중간 데이터 구조 역할을 할 객체를 만들어 준다. `const statementData = {};`

2단계 함수에서 invoice는 customer, performances를 쓰고 있는데, 이를 statementData에 넣은 채로 전달해주면 삭제 시킬 수 있다.
즉, 고객정보, 공연정보를 중간 구조에 넣어 전달한다.
`statementData.customer = invoice.customer;
statementData.performances = invoice.performances;`
...
invoice —> data

연극 제목도 중간 구조에 추가해준다.
statementData.performances = invoice.performances.map(enrichPerformance);

```jsx
< 얕은 복사 >
function enrichPerformance(aPerformance){
	const result = Object.assign({}, aPerformance);
	return result;
}
```

### 함수 옮기기

연극 정보를 담을 공간이 마련됐으므로, 이에 해당하는 함수 playFor()를 옮겨준다.

enrichPerformance의 result에도 `result.play = playFor(result);` 를 이용해 연극 정보를 담아준다.

그러면, renderPlainText에서는 data라는 매개변수로 다 넘어왔기 때문에 
playFor(perf) → perf.play
playFor(aPerformance) → aPerformance.play
로 사용할 수 있다.

- result.amount
- result.volumeCredits

도 같은 방법으로 만들어 준다.

⇒ result에는 3가지의 정보를 가진채로 넘어갈 수 있다.

1. play
2. amount
3. volumeCredits

⇒ statementData 에는 4가지 정보가 들어있다.

1. customer
2. performances
3. totalAmount
4. totalVolumeCredits

### 반복문을 파이프라인으로 바꾸기

반복문 (for) 을 .reduce 를 이용하여 삭제.

```jsx
function totalVolumeCredits(data) {
    let volumeCredits = 0;
    for(let perf of data.performances){
        volumeCredits += perf.volumeCredits;
    }
    return volumeCredits;
}

function totalAmount(data){
    let totalAmount = 0;
    for(let perf of data.performances){
        totalAmount+= perf.amount;
    }
    return totalAmount;
}
```

```jsx
function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}
function totalAmount(data){
    return data.performances.reduce((total, p) => total + p.amount, 0);
}
```

### 별도 파일 저장.

1. statement.js
2. createStatementData.js

⇒ 

![Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%203.png](Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%203.png)

![Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%204.png](Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%204.png)

# 1단계 튜토리얼 2차 중간 결과.

- 파일이 2개로 나뉘었다.

    ![Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%205.png](Refactoring%20f8fd8e2708264079aee412979b230773/Untitled%205.png)

- 44줄 짜리 코드가 70줄 이상으로 늘어났다.

    ⇒ 함수 추출 과정에 생기는 괄호가 많이 늘어남.

- 전체 로직을 구성하는 각각 요소들이 부각됨.
- 계산하는 부분 / 출력하는 부분 이 분리 됨.

> 캠핑러들이 '도착했을 때보다 깔끔하게 정돈하고 떠난다' 를 추구하는 것 처럼,
코드도 작업 시작 전보다 건강하게 만들어놓고 마쳐야 한다.

# 계산 코드 재구성 (다형성 활용.)

- 장르 추가.
- 장르마다 공연료와 적립 포인트 계산 다르게 지정.

```jsx
switch (aPerformance.play.type){
  case "tragedy":
      ...
			...
      break;
  case "comedy":
```

- 기존에 조건문으로 수동적으로 나뉘어있는 것을 개선하는 작업.
- ES6 이후 객체지향 활용할 수 있는 문법과 구조 사용.
- <다형성>

### 공연료 계산기 만들기

현 Logic :  amountFor() 와 volumeCreditsFor() 를 이용하여 enrichPerformance()가 계산하여 중간 데이터 구조를 채워넣는다.

개선 : amountFor() 와 volumeCreditsFor() 를 Class로 만들자.

```jsx
function enrichPerformance(aPerformance){
    **const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance);**
    const result = Object.assign({}, aPerformance);
    ~~result.play = playFor(result);
    result.amount = amountFor(result);
		result.volumeCredits = volumeCreditsFor(result);~~
		// 계산기의 메소드 사용.
		~~~~**result.play = calculator.play;
		result.amount = calculator.amount;**
    **result.volumeCredits = calculator.volumeCredits;**

    return result;
}

```

```jsx
class PerformanceCalculator{
    constructor(aPerformance, aPlay){
        this.performance = aPerformance;
        this.play = aPlay;
    }
		get play(){

				
		}
		get amount(){
			let result = 0;
	    switch (this.play.type){
	        case "tragedy":
	            result = 40000;
	            if(this.performance.audience > 30){
	                result += 1000 * (this.performance.audience -30);
	            }
	            break;
	        case "comedy":
	            result = 30000;
	            if(this.performance.audience > 20){
	                result += 10000 + 500 * (this.performance.audience - 20);
	            }
	            result += 300* this.performance.audience;
	            break;
	        default:
	            throw new Error(`알 수 없는 장르 : ${this.play.type}`);
	    }
	    return result;
		}
		get volumeCredits(){
			let result = 0;
			result += Math.max(this.performance.audience - 30, 0);
			if("comedy" === this.play.type)
					result += Math.floor(this.performance.audience / 5);
			return result;
		}
}
```

- 계산기 생성.

→ 계산기에 공연정보를 전달해주어야 함.

→ 계산기에 적립 포인트 계산도 전달.

### 타입 코드를 서브클래스로 바꾸기

- 다형성 지원을 위함.
- **PerformanceCalculator**의 서브클래스 준비 → **createStatementData()**에서 적절한 서브클래스를 사용하도록 만들어야 함.
- JavaScript 에서는 생성자가 서브클래스의 인스턴스를 반환할 수 없어서 **생성자 대신 함수를 호출**하도록 바꿔야 함.

### 생성자를 팩터리 함수로 바꾸기.

- 생성자 대신 함수를 호출하도록.

```jsx
function enrichPerformance(aPerformance){
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
    ...
}
```

```jsx
function createPerformanceCalculator(aPerformance, aPlay){
    return new PerformanceCalculator(aPerformance, aPlay);
}

function enrichPerformance(aPerformance){
    **const calculator = createPerformanceCalculator(aPerformance, playFor(aPeformance));**
    ...
}
```

- 어느 것을 반환할지 선택하도록.

```jsx
class TragedyCalculator extends PerformanceCalculator{
    get amount(){
        let result = 40000;
        if (this.performance.audience > 30){
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}
class ComedyCalculator extends PerformanceCalculator{
    get amount(){
        switch(this.play.type){
            case "tragedy":
                throw '오류 발생';
            case "comedy":
                let result = 30000;
                if (this.performance.audience > 20){
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르 : ${this.play.type}`);
        }
        return result;
    }
}
```

TragedyCalculator는 일반적으로 amount()대해 작성한 코드.

ComedyCalculator는 tragedy가 들어올 것을 방지하면서 작성한 코드.

⇒ 서브클래스에서 각자의 amount()를 가지게 되었다.

슈퍼클래스에서는 더이상 amount() 가 필요없다.

but, 저자의 Tip : 미래의 나에게

```jsx
class PerformanceCalculator{
    ...
    get amount(){
        throw new Error('서브 클래스에서 처리하도록 설계');
    }
```

- volumeCredits는 슈퍼클래스에서 서브클래스에 살짝만 다르게 적용.

```jsx
get volumeCredits(){
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
}
get volumeCredits(){
        let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if("comedy" === this.play.type)
            result += Math.floor(this.performance.audience / 5);
    return result;
}
```

## 결과

1. 2가지의 파일로 분리되었다.
2. 1개의 클래스와 2개의 서브클래스가 생성되었다.
3. 기능 추가 시 if문에 나열해야 됬던 것이.

    서브클래스 추가.
    서브클래스 생성자를 생성하는 함수에 추가.

    만으로 기능 추가 가능.

4. 계산기 사용을 보여줌으로써 중간 데이터 구조를 보여줄 수 있다.

### 

> 좋은 코드를 가늠하는 확실한 방법 중 하나는 '얼마나 수정하기 쉬운가'인데, 이에 만족하는 코드로 리팩토링 됐다.