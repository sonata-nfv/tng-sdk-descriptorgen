#!groovy

pipeline {
    agent any
    stages {
        stage('Container build') {
            steps {
                echo 'Stage: Building...'
                sh "pipeline/build/build.sh"
            }
        }
        stage('Unittests') {
            steps {
                echo 'Stage: Testing...'
                sh "pipeline/unittest/test.sh"
            }
        }
        stage('Style check') {
            steps {
                echo 'Stage: Style check not yet implemented (there is no js standard)'
            }
        }
		stage('Promoting containers to integration env') {
            steps {
                echo 'Integration tests don't make sense for the GUI/Javascript descriptorgen --> skipped'
            }
		}
        stage('Smoke tests') {
            steps {
                echo 'Stage: Smoke test... (not implemented)'
            }
        }
		stage('Container publication') {
            steps {
                echo 'Stage: Container publication...'
                sh "pipeline/publication/publication.sh"
            }
        }
    }
    post {
         success {
                 emailext(
                     from: "jenkins@sonata-nfv.eu",
                     to: "stefan.schneider@upb.de",
                     subject: "SUCCESS: ${env.JOB_NAME}/${env.BUILD_ID} (${env.BRANCH_NAME})",
                     body: "${env.JOB_URL}"
                 )
         }
         failure {
                  emailext(
                     from: "jenkins@sonata-nfv.eu",
                     to: "stefan.schneider@upb.de",
                     subject: "FAILURE: ${env.JOB_NAME}/${env.BUILD_ID} (${env.BRANCH_NAME})",
                     body: "${env.JOB_URL}"
                  )
         }
    }
}
