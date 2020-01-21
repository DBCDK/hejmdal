#!groovy​

def app
def imageName="hejmdal"
def imageLabel=BUILD_NUMBER

pipeline {
    agent {
        label 'devel9-head'
    }
    environment {
		IMAGE_NAME = "${imageName}:${imageLabel}"
		DOCKER_TAG = "${imageLabel}"
		GITLAB_PRIVATE_TOKEN = credentials("metascrum-gitlab-api-token")
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
                        sh "docker pull docker.dbc.dk/cypress:latest" 
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
                    docker.withRegistry('https://docker-ux.dbc.dk', 'docker') {
                        app.push()
                        app.push("latest")
                    }
                }
            } }
        }
        stage("Update staging version number") {
			agent {
				docker {
					label 'devel9-head'
					image "docker-io.dbc.dk/python3-build-image"
					alwaysPull true
				}
			}
			when {
				branch "master"
			}
			steps {
				dir("deploy") {
					git(url: "gitlab@gitlab.dbc.dk:frontend/hejmdal-configuration.git", credentialsId: "gitlab-svi", branch: "staging")
					sh """#!/usr/bin/env bash
						set -xe
						rm -rf auto-committer-env
						python3 -m venv auto-committer-env
						source auto-committer-env/bin/activate
						pip install -U pip
						pip install git+https://github.com/DBCDK/kube-deployment-auto-committer#egg=deployversioner
						set-new-version configuration.yaml ${env.GITLAB_PRIVATE_TOKEN} 170 ${env.DOCKER_TAG} -b staging
					"""
				}
			}
		}
    }
    post {
        always {
            sh "docker-compose down -v"
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
