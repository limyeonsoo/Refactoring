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