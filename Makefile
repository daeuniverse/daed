OUTPUT=daed

.PHONY: submodules submodule web

all: daed

## Begin Git Submodules
.gitmodules.d.mk: .gitmodules
	@set -e && \
	submodules=$$(grep '\[submodule "' .gitmodules | cut -d'"' -f2 | tr '\n' ' ') && \
	echo "submodule_paths=$${submodules}" > $@

-include .gitmodules.d.mk

$(submodule_paths): .gitmodules.d.mk
	git submodule update --init --recursive -- $@ && \
	touch $@

submodule submodules: $(submodule_paths)
	@if [ -z "$(submodule_paths)" ]; then \
		rm -f .gitmodules.d.mk; \
		echo "Failed to generate submodules list. Please try again."; \
		exit 1; \
	fi
## End Git Submodules

## Begin Web
node_modules: package.json pnpm-lock.yaml
	pnpm i

web: node_modules
	pnpm build
## End Web

## Begin Bundle
DAE_WING_READY=wing/vendor/github.com/daeuniverse/dae/control/headers wing/graphql/service/config/global/generated_resolver.go

$(DAE_WING_READY): wing
	cd wing && \
	make deps

daed: submodule $(DAE_WING_READY) web
	cd wing && \
	make OUTPUT=../$(OUTPUT) WEB_DIST=../dist bundle
## End Bundle
