pipeline {
agent any

environment {
    PROJECT_DIR = "/home/andre/websites-feitos/meninadahorta"
}

stages {

    stage('Sync Project') {
        steps {
            sh '''
            rsync -av --delete \
            --exclude '.git' \
            --exclude '.env' \
            --exclude 'node_modules' \
            --exclude '__pycache__' \
            ./ $PROJECT_DIR/
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
        echo 'Deploy concluído com sucesso!'
    }

    failure {
        echo 'Erro no deploy!'
    }

}


}
