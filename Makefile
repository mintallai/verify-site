SERVICE_NAME=verify-site

# $sha is provided by jenkins
BUILDER_TAG?=$(or $(sha),$(SERVICE_NAME)-builder)
CI_TAG?=$(or $(sha),$(SERVICE_NAME)-ci)
IMAGE_TAG=$(SERVICE_NAME)-img
IMAGE_TAG_S3_SHA=$(sha)-img

default: ci

login:
	@echo docker login -u ARTIFACTORY_USER -p ARTIFACTORY_API_TOKEN docker-asr-release.dr.corp.adobe.com
	@docker login -u $(ARTIFACTORY_USER) -p $(ARTIFACTORY_API_TOKEN) docker-asr-release.dr.corp.adobe.com

clean:
	rm -rf dist node_modules

# This target is called by the Jenkins "ci" job. It builds and runs the builder image,
# which should build the project and run unit tests, and optionally, code coverage.
ci:
	docker build -t $(CI_TAG) -f Dockerfile.ci.mt .
	docker run \
		-e PATH_PREFIX \
		-e PUSH_ARTIFACTS \
		-e ARTIFACTORY_API_TOKEN \
		-e ARTIFACTORY_USER \
		-e CI_PULL_REQUEST=$(ghprbPullId) \
		-e TESSA2_API_KEY \
		--ipc=host \
		$(CI_TAG)

# This target is called by the Jenkins "build" job.
build: login
	# First, build and run the builder image.
	docker build --pull -t $(BUILDER_TAG) -f Dockerfile.build.mt .
	# Run the builder image to do the actual code build, run unit tests,
	# and prepare the artifacts for deployment (move them into the hash
	# folder, prepare the manifest, etc.). The results are placed in the current
	# directory of the local file system.
	docker run \
	-v `pwd`:/build:z,cached \
	-e PATH_PREFIX \
	-e PUSH_ARTIFACTS \
	-e ARTIFACTORY_API_TOKEN \
	-e ARTIFACTORY_USER \
	-e PUBLIC_GITHUB_PACKAGE_TOKEN \
	-e TESSA2_API_KEY \
	$(BUILDER_TAG)
	# Package the built content it into a deployer image.
	# This deployer image knows how to push the artifacts to S3 when run.
	docker build --pull -t $(IMAGE_TAG) .