#!groovy​

def DEPLOY_REPO = 'frontend/hejmdal-configuration'
def app
def imageName="hejmdal"
def imageLabel=BUILD_NUMBER

pipeline {
    agent {
        label 'devel11-head'
    }
    environment {
		    IMAGE_NAME = "${imageName}:${imageLabel}"
		    DOCKER_TAG = "${imageLabel}"
		    GITLAB_PRIVATE_TOKEN = credentials("metascrum-gitlab-api-token")
	  }
    options {
      timestamps()
      disableConcurrentBuilds()
    }
    stages {
        stage('Build image') {
            steps {
                script {
                    ansiColor("xterm") {
                        // Work around bug https://issues.jenkins-ci.org/browse/JENKINS-44609 , https://issues.jenkins-ci.org/browse/JENKINS-44789
                        sh "docker build -t $imageName:${imageLabel} --pull --no-cache ."
                        app = docker.image("$imageName:${imageLabel}")
                    }
                }
            }
        }
        stage('Integration test') {
            steps {
                script {
                    ansiColor("xterm") {
                        sh "docker pull docker-dbc.artifacts.dbccloud.dk/cypress:latest"
                        sh "docker-compose build"
                        sh "IMAGE=${IMAGE_NAME} docker-compose run --rm e2e"
                    }
                }
            }
        }
        stage('Push to Artifactory') {
            when {
                branch "master"
            }
            steps {
                script {
                    if (currentBuild.resultIsBetterOrEqualTo('SUCCESS')) {
                        docker.withRegistry('https://docker-fbiscrum.artifacts.dbccloud.dk', 'docker') {
                            app.push()
                            app.push("latest")
                        }
                    }
                }
            }
        }
        stage("Update staging version number") {
			      agent {
				        docker {
				            label "devel10"
                    image "docker-dbc.artifacts.dbccloud.dk/build-env:latest"
					          alwaysPull true
				        }
			      }
			      when {
				      branch "master"
			      }
			      steps {
					          sh """
					            	set-new-version configuration.yaml ${env.GITLAB_PRIVATE_TOKEN} ${DEPLOY_REPO} ${env.DOCKER_TAG} -b staging
					            """
			      }
        }
    }
    post {
        always {
            sh """
                echo Clean up
                mkdir -p logs
                docker-compose logs web > logs/web-log.txt
                docker-compose down -v
                docker rmi ${IMAGE_NAME}
            """
            archiveArtifacts 'e2e/cypress/screenshots/*, e2e/cypress/videos/*, logs/*'
            junit 'e2e/reports/*.xml'
        }
        failure {
            script {
                if ("${env.BRANCH_NAME}" == 'master') {
                    slackSend(channel: 'fe-drift',
                        color: 'warning',
                        message: "${env.JOB_NAME} #${env.BUILD_NUMBER} failed and needs attention: ${env.BUILD_URL}",
                        tokenCredentialId: 'slack-global-integration-token')
                }
            }
        }
        success {
            script {
                if ("${env.BRANCH_NAME}" == 'master') {
                    slackSend(channel: 'fe-drift',
                        color: 'good',
                        message: "${env.JOB_NAME} #${env.BUILD_NUMBER} completed, and pushed ${IMAGE_NAME} to artifactory.",
                        tokenCredentialId: 'slack-global-integration-token')

                }
            }
        }
        fixed {
            slackSend(channel: 'fe-drift',
                color: 'good',
                message: "${env.JOB_NAME} #${env.BUILD_NUMBER} back to normal: ${env.BUILD_URL}",
                tokenCredentialId: 'slack-global-integration-token')

        }
    }
}
