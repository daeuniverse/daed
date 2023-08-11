OUTPUT ?= daed
APPNAME ?= daed
VERSION ?= 0.0.0.unknown

.PHONY: submodules submodule

daed:

all: clean daed

clean:
	rm -rf dist && rm -f daed

## Begin Git Submodules
.gitmodules.d.mk: .gitmodules Makefile
	@set -e && \
	submodules=$$(grep '\[submodule "' .gitmodules | cut -d'"' -f2 | tr '\n' ' ' | tr ' \n' '\n' | sed 's/$$/\/.git/g') && \
	echo "submodule_ready=$${submodules}" > $@

-include .gitmodules.d.mk

$(submodule_ready): .gitmodules.d.mk
ifdef SKIP_SUBMODULES
	@echo "Skipping submodule update"
else
	git submodule update --init --recursive -- "$$(dirname $@)" && \
	touch $@
endif

submodule submodules: $(submodule_ready)
	@if [ -z "$(submodule_ready)" ]; then \
		rm -f .gitmodules.d.mk; \
		echo "Failed to generate submodules list. Please try again."; \
		exit 1; \
	fi
## End Git Submodules

## Begin Web
PFLAGS ?=
ifeq (,$(wildcard ./.git))
	PFLAGS += HUSKY=0
endif
dist: package.json pnpm-lock.yaml
	$(PFLAGS) pnpm i
	pnpm build
## End Web

## Begin Bundle
DAE_WING_READY=wing/graphql/service/config/global/generated_resolver.go

$(DAE_WING_READY): wing
	cd wing && \
	$(MAKE) deps && \
	cd .. && \
	touch $@

daed: submodule $(DAE_WING_READY) dist
	cd wing && \
	$(MAKE) OUTPUT=../$(OUTPUT) APPNAME=$(APPNAME) WEB_DIST=../dist VERSION=$(VERSION) bundle
## End Bundle
