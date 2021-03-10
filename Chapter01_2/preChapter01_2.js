function statement(invoice, plays){
    function playFor(aPerformance){
        return plays[aPerformance.playID];
    }
    function amountFor(aPerformance){ // play는 변하지 않는다. 제거 가능.
        switch (playFor(aPerformance).type){
            case "tragedy":
                result = 40000;
                if(perf.audience > 30){
                    result += 1000 * (perf.audienc -30);
                }
                break;
            case "comedy":
                result = 30000;
                if(perf.audience > 20){
                    result += 10000 + 500 * (perf.audience - 20);
                }
                result += 300* perf.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
        }
        return result;
    }
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명  ${invoice.customer})\n`

    // Intl : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl 각 언어에 맞게 비교 기능.
    const format = new Intl.NumberFormat("en-US", {
        style : "currency", currency: "USD", minimumFractionDigits: 2
    }).format;
    
    for(let perf of invoice.performances){
        
        // let thisAmount = 0;   --> 함수 호출로 변경.
        let thisAmount = amountFor(perf, playFor(perf));
        // switch 문이 있던 자리.

        // 포인트 적립 및 추가 포인트 적립.
        volumeCredits += Math.max(perf.audience - 30, 0);
        if("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

        result += `${playFor(perf).name} : ${format(thisAmount/100)} (${perf.audience}석)\n`;
        totalAmount += thisAmount;
    }

    result += `총액 : ${format(totalAmount/100)}`;
    result += `적립 : ${volumeCredits}점\n`;

    return result;
}

const invoices = require('./invoices.json'); 
const plays = require('./plays.json');

console.log(statement(invoices[0], plays));