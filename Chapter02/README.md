# 2. Refactoring Rule

### 리팩토링 (noun) & (verb)

> 소프트웨어의 겉보기 동작은 그대로 유치한 채.
1. 코드를 이해하고 수정하기 쉽도록 내부 구조를 변경하는 기법.
2. 여러 가지 리팩터링 기법을 적용해서 소프트웨어를 재구성하다.

### ⭐ 리팩토링 과정에서 발견된 버그는 리팩터링 후에도 그대로 남아 있어야 한다.

→ 이유 : 리팩터링은 기능 추가 의 단계가 아니라, 코드 변경의 단계이다.

⇒ 수정 시점 : '기능 추가' 단계

⇒ 개발 시 : '기능 추가' → '리팩터링' → '기능 추가' → '리팩터링' → ... ... 반복.
(중간에 test를 이용하여 진척도 확인)

### But, 동작상 작은 수정.

1. 콜스택이 달라질 때 : 함수 추출하기 등으로 인해 콜스택 순서가 바뀔수 있음.
2. 모듈의 인터페이스 : 함수 옮기기 / 함수선언 바꾸기 등으로 인터페이스가 바뀔 수 있음.

### ⭐ 리팩토링 과정에서 성능이 나빠질 수 있다.

리팩토링의 목적은 코드의 이해도 향상이지, 성능은 관련없다.
→ '성능 최적화'단계에서 성능 향상 목표에 도달해야 한다.

# 리팩토링의 목적

1. 소프트웨어 설계가 좋아진다.
    - 아키텍처 이해가 됨. → 구조가 무너지지 않는다.
    - 중복 코드가 제거 됨.
2. 소프트웨어 이해가 쉬워진다.
    - 이해가 쉬우면 코드 수정이 쉽다.
    - 이해가 쉬우면 의사 전달이 쉽다.
    - 이해가 쉬우면 기억하기 쉽다.
3. 버그를 쉽게 찾을 수 있다.
    - 이해하기 쉬우니 버그를 쉽게 찾을 수 있다.
4. 프로그래밍 속도를 높일 수 있다.
    - 내부 설계 탄탄 & 가독성 개선 & 버그 감소 ⇒ 프로그래밍 속도 향상.
    - 모순이라 생각 할 수 있음. 리팩토링 시간이 오래 걸리니 속도가 느리지 않냐.

    ![2%20Refactoring%20Rule%20b269365299d14321abadca80e6c9f95c/Untitled.png](2%20Refactoring%20Rule%20b269365299d14321abadca80e6c9f95c/Untitled.png)

# 언제?

> Don Roberts :
1. 처음에는 그냥 한다.
2. 비슷한 일을 2번 하게 되면 계속 진행한다.
3. 비슷한 일을 3번 마주하게 되면 리팩터링 해야한다.

### 리팩터링 목적.

1. 준비를 하기 위한 리팩터링.

    : 기능을 추가하기 바로 직전이 가장 좋은 시점. → 구조를 살짝 바꾸면 다른 작업이 쉬워지는 장점을 살릴 수 있다.

2. 이해를 하기 위한 리팩터링.
    - 더 명확.
    - 다른사람이 보기 쉬움.
    - 머리 속에 것을 코드로 옮겨 표현 가능.
    - 코드가 깔끔해지면 눈에 뜨지않던 다른 설계도 눈에 들어오게 됨.
3. 쓰레기 줍기 위한 리펙터링.
    - 중복된 코드.
    - 하나의 함수로 합칠 수 있는 조각들.
    - 간단한 리팩터링 : 즉시
    걸리는 리팩터링 : 메모

### 계획된 리팩터링 or 수시로 하는 리팩터링.

if문을 쓸때 철저한 계획을 하지 않는 것 처럼 리팩터링도 프로그래밍의 일부 처럼 ⇒ 수시로

리팩터링이 그동안 소홀했다면, 규모가 커졌으므로 최대한 빨리 계획세우고 리팩터링.

리팩터링 커밋을 따로 분리할 필요가 없다. 시간 낭비가 될 수 있지만, 팀의 방식에 따라 적합하게.

### 코드리뷰 + 리팩터링

코드리뷰의 장점 : 

- 다른 사람의 아이디어를 얻을 수 있다.
- 자신의 관점이 아닌 다른 사람의 관점을 느낄 수 잇다.
- 절대로 떠올릴 수 없던 아이디어가 떠오를 수 있다.
- 팀원 모두가 이해할 수 있다.

### 리팩터링 하지 말아야 할 때

지저분하더라도 굳이 수정할 필요가 없다면 하지 않는다.

내부 동작에 대한 이해가 필요할 때 효과를 볼 수 있다.

처음부터 새로 시작하는게 더 낫다면 리팩터링하지 않는다.

# 리팩터링 시 고려할 문제

### 개발속도가 저하된다?

No, 리팩터링의 궁극적인 목표가 개발 속도를 높여서, 더 적은 노력으로 더 많은 가치를 창출하는 것.

위의 그래프를 참고하면 좋을 것 같다.

리팩터링 후에 기능 수정, 변경을 손 쉽게 할 수 있다.

코드 구조가 이해되면 기능 수정, 변경을 손 쉽게 할 수 있다.

### 클린 코드와 같다?

No, 클린 코드는 코드를 예쁘게 하여 이해를 돕는데 있고,
리팩터링은 경제적 측면으로 접근해야 맞다.

### 코드 소유권

회사마다 다르지만, 코드의 소유권에 따라 리팩토링 가능 여부가 다르다.

- 코드의 소유가 다른 팀이거나
- 바꾸려는 함수가 다른 곳에 사용되고 있거나,
- 바꾸려는 함수가 클라이언트에게 API로 제공되고 있다면 (공개된 인터페이스)
@requestMapping  (spring)  ???
app.get,   app.post  (node)    ???

리팩토링이 쉽지 않다.

⇒ 소유권이 자유로울 수록 좋다.

### Branch & CI, TBD, XP

CI : Continuous Integration 지속적 통합

TBD : Trunk-Based Development 트렁크 기반 개발

XP : Extreme Programming  CI와 리팩터링을 합친 용어

- master branch 에 한번에 통합하려고 하는 경우 → 굉장히 안좋다.
- 단방향 (머지) : master 에 개인의 branch를 merge 
master의 내용은 그대로.
- 양방향 (통합) : master를 개인 branch로 가져와서 작업 후 push
master의 내용 변경.

→ branch 통합 주기를 짧게 할 수록 좋다.

### 테스트

리팩터링 과정에 버그가 생길 위험이 크다는 불안감이 있다면?

→ 견고한 테스트를 마련해놓으면 해결.

( + 자동 리팩터링 기능을 사용하여 해결하는 경우도 있긴함.)

**CI 에 통합된 Test 는 XP의 권장사항이자 CD(지속적배포)의 핵심.**

레거시 코드를 리팩터링 할 때도 요구되는게 테스트.

### 데이터베이스

커다란 변경을 쉽게 조합하고 컨트롤 할 데이터 마이그레이션 스크립트 작성.
이를 이용하여 스키마에 대한 구조적 변경.

ex) 예전 필드를 사용하는 데이터 모두가 새 필드를 사용하도록 변환.

1. 새 필드를 바로 사용하지 않고 만들기만 한다.
2. 기존 필드와 새 필드를 동시에 업데이트 하도록 설정.
3. 이 과정에서 발생하는 버그 해결.
4. 이전 필드가 필요없어지면 삭제

⇒ 병렬, 팽창-수축 방식.

# 애그니(YAGNI)

옛날 : 코딩 시작 전 설계, 아키텍처는 바뀔 수 없으니 주의하면서 코딩해야한다.

현재 : 리팩터링으로 기존 코드의 설계를 얼마든지 개선해야 한다.

이때 필요한 것 :

1. 리팩터링
2. 테스트

### 유연성 메커니즘 vs 애그니

코딩하다가 쓰일 것 같아서 미리 만들어 두는 것 같은 유연하게 해놓는 느낌.

→ 애그니 : 간결한 설계, 점진적 설계 : 현재 해당 하는 것만 만들어놓고, 필요할 때 리팩토링을 통해 개선하면 된다.

( 나도 typescript에서 Interface를 정의하거나 할 때, 쓰일 것 같은 것들을 미리 다 선언을 해놓았었는데 이런 것을 유연성 메커니즘이라 하는 것 같다)

# 리팩터링 + SW개발 프로세스

- XP

    지속적 통합 + 자가 테스트 + 리팩터링

- TDD

    자가 테스트 + 리팩터링

- 애자일

    그냥 자주 정리 하는 것을 애자일로 볼 수도 있겠지만, 더 개선하자면
    애자일을 극대화 하기 위해 테스트, 지속적 통합을 또 하기 위해서 리팩터링을 하면서 코드의 이해도 향상

    ⇒ 3가지를 적용하면 애그니 설계 방식

# 리팩터링 성능

리팩터링 시 SW속도가 '느려질수도' 있는 것은 사실이다.
→ 하지만, 그와 동시에 성능을 튜닝하기 더 쉬워진다.
⇒ 튜닝하기 쉽게 만들고, 원하는 성능으로 튜닝하자!

### 빠른 SW를 작성하는 세 가지 저자의 경험. 1 < 2 <<< 3

1. 시간 예산 분배 방식

    하드 리얼 타임 시스템에서 많이 사용. ( 이 시스템이 아니면 비효율적 )
    각 컴포넌트 마다 자원( 시, 공간)을 다르게 할당 해놓는다.

2. 끊임없는 관심.

    추측보단 측정을
    시간 낭비를 하지 않는 시간 투자
    이해를 해야 최적화를 할 수 있다.

3. 성능 최적화 단계를 나눠놓는다.

    최적화 돌입 전까지는 다루기 쉬울정도로만 코드를 작성한다.
    최적화 대상을 찾기 쉬워서 접근이 용이하다.

    리팩터링이 잘 되있는 프로그램은 성능을 더 세밀하게 분석할 수 있다.

# 리팩터링 자동화

<인텔리제이 IDEA> or <이클립스> 등 많은 IDE, 에디터들이 리팩터링 자동화를 지원해준다.

### 텍스트 조작 vs 구문 트리(syntax tree) 조작

텍스트 조작은 텍스트 코드를 조작해서 리팩터링 하는 것.
어설픈 방법이라 할 수 있다. 텍스트만 바꿨다가 내부의 의미가 깨질 수 있다.
또한, 이름만 같을 뿐, 다른 코드였다면 확실히 망해버린다.

구문 트리 조작은 원래 의미를 보존하는데 효과적이라서 더 안정적이다.
단, 구문 트리 조작 후 텍스트로 표현하는 것이 가장 어렵다.

텍스트 조작 + 구문트리 조작을 동시에 한다면 더 좋다.