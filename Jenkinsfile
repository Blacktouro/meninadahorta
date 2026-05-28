pipeline {
agent any

environment {
    PROJECT_DIR = "/home/andre/websites-feitos/meninadahorta"
}

stages {

    stage('Pull') {
        steps {
            sh '''
            cd $PROJECT_DIR
            git pull origin main
            '''
        }
    }

    stage('Build') {
        steps {
            sh '''
            cd $PROJECT_DIR
            docker compose build
            '''
        }
    }

    stage('Deploy') {
        steps {
            sh '''
            cd $PROJECT_DIR
            docker compose up -d
            '''
        }
    }

}

post {
    success {
        echo 'Deploy concluído!'
    }

    failure {
        echo 'Erro no deploy!'
    }
}

}
