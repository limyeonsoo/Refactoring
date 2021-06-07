# 4. 테스트 구축하기

Obj : 리팩터링을 제대로 하기 위해서는 견고한 테스트가 뒷받침 되야 한다.!!!

# Jest에서 import 구문 사용하기 → babel.config.js 필요.

```jsx
module.exports = {
    presets: [['@babel/preset-env', {targets: {node: 'current'}}]]
}
```

# 3단계 or 4단계

- 3단계

    설정-실행-검증 (setup-exercise-verify)

    조건-발생-결과 (given-when-then)

    준비-수행-단언 (arrange-act-assert)

    ===

- 4단계

    해체(teardown) or 청소(cleanup) 단계가 있었다.

    → beforeEach와 같은 설정을 이용하면 프레임워크가 알아서 해체 시켜 주기 때문에 명시적 수행이 줄어들었다.

## ⇒ beforeEach의 목적과 장점.

해당 describe 블록 안의 모든 테스트가 같은 기준의 데이터로 시작한다는 것을 보장.

# 가장 일반적인 함정.

## 1. 경계조건

- 비어있을 때
- 음수가 될 때

# 에러 와 실패 : 에러는 검증보다 앞선 과정에서 발생한 예외 상황.