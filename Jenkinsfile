pipeline {

agent {
    kubernetes {
        yamlFile 'agent.yaml'
    }
}

environment {
    FRONT_IMAGE = "jarojaslv/lab3-frontend:juan-rojas"
    BACK_IMAGE  = "jarojaslv/lab3-backend:juan-rojas"
    NAMESPACE   = "ns-juan-rojas"
}

stages {

    stage('install') {
        steps {
            echo 'Instalando dependencias'
        }
    }

    stage('test') {
        steps {
            echo 'Ejecutando pruebas'
        }
    }

    stage('build') {
        steps {
            echo 'Construyendo imagen frontend'
            echo "${FRONT_IMAGE}"

            echo 'Construyendo imagen backend'
            echo "${BACK_IMAGE}"
        }
    }

    stage('push') {
        steps {
            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )
            ]) {

                echo 'Autenticando contra Docker Hub'
                echo 'Publicando imagenes'
            }
        }
    }

   stage('deploy') {
       steps {

           container('kubectl') {

               sh '''
                kubectl apply -f entrega2.yml

               kubectl rollout status deployment/app-juan-rojas-back -n ns-juan-rojas

                kubectl rollout status deployment/app-juan-rojas-front -n ns-juan-rojas
                '''
            }
        }
    }




}

	

post {

    success {
        echo 'Pipeline ejecutado correctamente'
    }

    failure {
        echo 'Pipeline finalizado con errores'
    }
}


}
