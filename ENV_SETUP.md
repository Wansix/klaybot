# Klaybot - 텔레그램 봇 환경 변수 설정 가이드

## 필수 환경 변수

프로젝트를 실행하기 전에 다음 환경 변수들을 설정해야 합니다:

### 1. TELEGRAM_TOKEN
텔레그램 봇 토큰입니다. BotFather에서 발급받은 토큰을 입력하세요.
```
TELEGRAM_TOKEN=your_telegram_bot_token_here
```

### 2. KLAY_ENDPOINT
Klaytn 네트워크 RPC 엔드포인트입니다.
```
KLAY_ENDPOINT=https://klaytn-mainnet-rpc.allthatnode.com:8551
```

### 3. MONGODB_URI
MongoDB Atlas 연결 문자열입니다.
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/klaybot?retryWrites=true&w=majority
```

## 설정 방법

1. 프로젝트 루트 디렉토리에 `.env` 파일을 생성하세요.
2. 위의 환경 변수들을 복사하여 실제 값으로 수정하세요.
3. `.env` 파일은 절대 Git에 커밋하지 마세요.

## 보안 주의사항

- `.env` 파일은 `.gitignore`에 포함되어 있습니다.
- 실제 토큰이나 비밀번호를 코드에 하드코딩하지 마세요.
- 프로덕션 환경에서는 더 강력한 보안 설정을 사용하세요.
