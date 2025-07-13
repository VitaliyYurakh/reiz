pipeline {
    agent any

    environment {
        GIT_TOKEN = credentials('Test')
    }

    stages {
         stage('Pull latest code') {
            steps {
                dir('reiz') {
                    sh 'git pull https://VitaliyYurakh:${GIT_TOKEN}@github.com/VitaliyYurakh/reiz.git'
                }
            }
        }

        stage('Build and Restart Docker') {
            steps {
                dir('reiz') {
                    sh 'docker compose up -d --build'
                }
            }
        }
    }
}
