buld:
	pnpm run build 


bump:
	jq '(.version | split(".") | .[2] |= (tonumber + 1) | join(".")) as $$v | .version = $$v' package.json > tmp.$$$$ && mv tmp.$$$$ package.json

push:
	make bump && make buld && npm publish
install:
	rm -rf node_module && pnpm cache delete && pnpm i

link:
	npm link
