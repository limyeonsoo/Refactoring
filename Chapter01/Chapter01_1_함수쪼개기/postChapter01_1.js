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