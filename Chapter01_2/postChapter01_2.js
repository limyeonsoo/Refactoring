const invoices = require('./invoices.json'); 
const plays = require('./plays.json');

function statement(invoice, plays){
    function playFor(aPerformance){
        return plays[aPerformance.playID];
    }

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
                throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
        }
        return result;
    }
    function volumeCreditsFor(aPerformance){
        let volumeCredits = 0;
        volumeCredits += Math.max(aPerformance.audience - 30, 0);
        if("comedy" === playFor(aPerformance).type)
            volumeCredits += Math.max(aPerformance.audience / 5);
        return volumeCredits;
    }
    function format(aNumber){
        return new Intl.NumberFormat("en-US", {
            style : "currency", currency: "USD", minimumFractionDigits: 2
        }).format(aNumber);
    }
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명 ${invoice.customer})\n`;
    
    for(let perf of invoice.performances){
        // 포인트 적립 및 추가 포인트 적립.
        volumeCredits += volumeCreditsFor(perf);
        
        result += `${playFor(perf).name} : ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
        totalAmount += amountFor(perf);
    }
    result += `총액 : ${format(totalAmount/100)}\n`;
    result += `적립 : ${volumeCredits}점\n`;

    return result;
}

console.log(statement(invoices[0], plays));