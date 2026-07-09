.PHONY: install studio render typecheck benchmark

install:
	npm install

studio:
	npx remotion studio src/index.ts

render:
	npx remotion render src/index.ts AmplifyATS out/amplify-ats.mp4

typecheck:
	npx tsc --noEmit

benchmark:
	npx remotion benchmark src/index.ts AmplifyATS
