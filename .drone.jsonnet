#####################
### jsonnet convert to yaml
### command: dron jsonnet --steam
### 下完command後，會附蓋掉.drone.yml
#####################


local conditionTrigger(env="qa",product="yabo")=
(
    if env =="QA" || env== "Beta" then {
        ref: ["refs/tags/"+ product +"QA-*"],
        event: ["tag"],
    // }else if env=="Beta" then {
    //     ref: ["refs/tags/"+ product +"Beta-*"],
    //     event: ["tag"],
    }else if env=="Prod" || env== "Demo" then  {
        ref: ["refs/tags/"+ product +"Prod-*"],
        event: ["tag"],
    }
);



local Build(name="QA",cluster="xbb-common",zone="asia-east1-a",
env="qa",deployName="yaboxxx-landing-page-qa",nginxssl="nginx-ssl",nginxConfig="yaboxxx-landing-page-nginx"
,imageName="yaboxxx-landingpage",nfs="10.27.1.142",product="yabo",origin="origin",
env2="",cluster2="",deployName2="",nginxssl2="",nginxConfig2="",nfs2="")={
    kind: "pipeline",
    name: product+"Pipeline("+origin+ name +")",
    steps:[
        {

            name: "push2GCR-"+name,
            image: "plugins/gcr",
            mem_limit: "2G",
            depends_on: (if env=="prod" || env =="demo" then ["clone"]),
            settings: {
                repo: "gcr.io/rd7-project/"+imageName,
                tags: ["latest",env+"-${DRONE_COMMIT}","${DRONE_TAG}"],
                json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
                build_args: ["website="+env,"product="+product],
            },
        },
        {
            name: "deploy2GKE-"+env,
            image: "nytimes/drone-gke",
            depends_on: (if env=="prod" || env =="demo" then ["push2GCR-"+name]),
            environment:{
                TOKEN: {"from_secret": "GOOGLE_CREDENTIALS"},
            },
            settings:{
                project: "rd7-project",
                template:
                      if origin == "istio"  then "configs/"+ product+"/.istio-kube.yml"
                      else "configs/"+product+"/.kube.yml" ,                    
                vars:
                    {
                    "deployName":deployName,
                    "env":env,
                    "k8sNginxSSL":nginxssl,
                    "k8sNginxConfigMap":nginxConfig,
                    "imageName":"gcr.io/rd7-project/"+imageName+":${DRONE_TAG}",
                    "nfs":nfs,
                    }
                ,
                zone: zone,
                cluster: cluster,
            },
        },
        {
            name: "deploy2GKE-"+env2,
            image: "nytimes/drone-gke",
            depends_on: (if env=="prod" || env =="demo" then ["push2GCR-"+name]),
            environment:{
                TOKEN: {"from_secret": "GOOGLE_CREDENTIALS"},
            },
            settings:{
                project: "rd7-project",
                template:
                      if origin == "istio"  then "configs/"+ product+"/.istio-kube.yml"
                      else "configs/"+product+"/.kube.yml" ,                    
                vars:
                    {
                    "deployName":deployName2,
                    "env":env2,
                    "k8sNginxSSL":nginxssl2,
                    "k8sNginxConfigMap":nginxConfig2,
                    "imageName":"gcr.io/rd7-project/"+imageName+":${DRONE_TAG}",
                    "nfs":nfs2,
                    }
                ,
                zone: zone,
                cluster: cluster2,
            },
        },
        
    ],
    trigger:
        conditionTrigger(name,product)
    // trigger:
    //     ref: ["refs/heads/master"],
    //     event: ["tag"],

};

// local Pipeline(name="QA",cluster="xbb-common",zone="asia-east1-a",
// env="qa",deployName="yaboxxx-landing-page-qa",nginxssl="nginx-ssl",nginxConfig="yaboxxx-landing-page-nginx"
// ,imageName="yaboxxx-landingpage",nfs="10.27.1.142",product="yabo",origin="origin") = {
//     kind: "pipeline",
//     name: product+"Pipeline("+origin+ name +")",
//     steps:[
//         {

//             name: "push2GCR-"+name,
//             image: "plugins/gcr",
//             mem_limit: "2G",
//             depends_on: (if env=="prod" || env =="demo" then ["clone"]),
//             settings: {
//                 repo: "gcr.io/rd7-project/"+imageName,
//                 tags: ["latest",env+"-${DRONE_COMMIT}",
//                 + if env== "beta" || env== "qa" then "${DRONE_TAG}"
//                 else env=="demo" || 
//                 ],
//                 json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
//                 build_args: ["website="+env,"product="+product],
//             },
//             // when :
//             //     conditionWhen(env)
//             // when:
//             // {
//             //     branch: ["develop"]
//             //     event: ["push"],
//             // },
//         },
//         {
//             name: "deploy2GKE-"+name,
//             image: "nytimes/drone-gke",
//             depends_on: (if env=="prod" || env =="demo" then ["push2GCR-"+name]),
//             environment:{
//                 TOKEN: {"from_secret": "GOOGLE_CREDENTIALS"},
//             },
//             settings:{
//                 project: "rd7-project",
//                 template:
//                       if origin == "istio"  then "configs/"+ product+"/.istio-kube.yml"
//                       else "configs/"+product+"/.kube.yml" ,                    
//                 vars:
//                     {
//                     "deployName":deployName,
//                     "env":env,
//                     "k8sNginxSSL":nginxssl,
//                     "k8sNginxConfigMap":nginxConfig,
//                     "imageName":"gcr.io/rd7-project/"+imageName+":${DRONE_TAG}",
//                     "nfs":nfs,
//                     }
//                 ,
//                 zone: zone,
//                 cluster: cluster,
//             },
//             // when :
//             //     conditionWhen(env)
//         },
//     ],
//     trigger:
//         conditionTrigger(name,product)
//     // trigger:
//     //     ref: ["refs/heads/master"],
//     //     event: ["tag"],
// };



[
    # yiyuan
    Build("QA","yaboxxx-test","asia-east1-b"
    ,"qa","cxbb-frontend-proxy-qa","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.142","yiyuan","origin",
    "beta","yaboxxx-prod","cxbb-frontend-proxy-beta","","cxbb-frontend-proxy-nginx-config-beta"
    ,"10.17.0.128"),

    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","cxbb-frontend-proxy-demo","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.0.181","yiyuan","origin",
    "prod","yaboxxx-prod","cxbb-frontend-proxy-prod","","cxbb-frontend-proxy-nginx-config-prod"
    ,"10.17.0.181"),

    # istio-yiyuan
    Build("QA","yaboxxx-test","asia-east1-b"
    ,"qa","yiyuan-frontend-proxy-qa","","yiyuan-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.142","yiyuan","istio",
    "beta","yaboxxx-prod","yiyuan-frontend-proxy-beta","","yiyuan-frontend-proxy-nginx-config-beta"
    ,"10.17.0.128"),
    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","yiyuan-frontend-proxy-demo","","yiyuan-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.0.181","yiyuan","istio",
    "prod","yaboxxx-prod","yiyuan-frontend-proxy-prod","","yiyuan-frontend-proxy-nginx-config-prod"
    ,"10.17.0.181"),


    # sigua
    Build("QA","yaboxxx-test","asia-east1-b"
    ,"qa","sgsp-frontend-proxy-qa","","sgsp-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.142","sigua","origin",
    "beta","yaboxxx-prod","sgsp-frontend-proxy-beta","","sgsp-frontend-proxy-nginx-config-beta"
    ,"10.17.0.128"),
    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","sgsp-frontend-proxy-demo","","sgsp-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.0.181","sigua","origin",
    "prod","yaboxxx-prod","sgsp-frontend-proxy-prod","","sgsp-frontend-proxy-nginx-config-prod"
    ,"10.17.0.181"),

    # istio-sigua
    Build("QA","yaboxxx-test","asia-east1-b"
    ,"qa","sigua-frontend-proxy-qa","","sigua-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.142","sigua","istio",
    "beta","yaboxxx-prod","sigua-frontend-proxy-beta","","sigua-frontend-proxy-nginx-config-beta"
    ,"10.17.0.128"),


    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","sigua-frontend-proxy-demo","","sigua-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.0.181","sigua","istio",
    "prod","yaboxxx-prod","sigua-frontend-proxy-prod","","sigua-frontend-proxy-nginx-config-prod"
    ,"10.17.0.181"),

    # yabo
    // Build("QA","yaboxxx-test","asia-east1-b"
    // ,"test","frontend-proxy","frontend-proxy","frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.27.1.142","yabo","origin",
    // "beta","yaboxxx-prod","yabo-beta-frontend-proxy","yabo-frontend-proxy","yabo-beta-frontend-proxy-nginx-config"
    // ,"10.17.0.128"),
    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","yabo-demo-frontend-proxy","yabo-frontend-proxy","yabo-demo-frontend-proxy-nginx-config"
    ,"yaboxxx-web","10.17.0.181","yabo","origin",
    "prod","yaboxxx-prod","yabo-prod-frontend-proxy","yabo-frontend-proxy","yabo-prod-frontend-proxy-nginx-config"
    ,"10.17.0.181"),

    #istio-yabo
    Build("QA","yaboxxx-test","asia-east1-b"
    ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
    ,"yaboxxx-web","10.27.1.142","yabo","istio",
    "beta","yaboxxx-prod","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
    ,"10.17.0.128"),
    Build("Prod","yaboxxx-prod","asia-east1-b"
    ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
    ,"yaboxxx-web","10.17.0.181","yabo","istio",
    "prod","yaboxxx-prod","yabo-prod-frontend-proxy","","yabo-frontend-proxy-nginx-config-prod"
    ,"10.17.0.181"),

    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.142","yabo","istio"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.0.128","yabo","istio"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.0.181","yabo","istio"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","yabo-prod-frontend-proxy","","yabo-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.0.181","yabo","istio"),


//     (name="QA"（環境),cluster="xbb-common"（叢集),zone="asia-east1-a"(區域),
// env="qa"(GKE的label),deployName="yaboxxx-landing-page-qa"(GKE的名稱),nginxssl="nginx-ssl",nginxConfig="nginx"(GKE的configMap,nginx設定檔名稱),
// imageName="yaboxxx-landingpage"(GCR映像檔名稱),nfs="10.27.1.142"(nfs-server))
    
    // # sigua
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","sgsp-frontend-proxy-qa","","sgsp-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.142","sigua","origin"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","sgsp-frontend-proxy-beta","","sgsp-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.0.128","sigua","origin"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","sgsp-frontend-proxy-demo","","sgsp-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.0.181","sigua","origin"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","sgsp-frontend-proxy-prod","","sgsp-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.0.181","sigua","origin"),
    
    // # istio-sigua

    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","sigua-frontend-proxy-qa","","sgsp-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.142","sigua","istio"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","sigua-frontend-proxy-beta","","sgsp-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.0.128","sigua","istio"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","sigua-frontend-proxy-demo","","sgsp-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.0.181","sigua","istio"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","sigua-frontend-proxy-prod","","sgsp-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.0.181","sigua","istio"),
    


    // # yabo(  nginxssl 屬特例情況，在客端沒在使用，故改用當label)
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"test","frontend-proxy","frontend-proxy","frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.27.1.142","yabo","origin"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","yabo-beta-frontend-proxy","yabo-frontend-proxy","yabo-beta-frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.17.0.128","yabo","origin"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","yabo-demo-frontend-proxy","yabo-frontend-proxy","yabo-demo-frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.17.0.181","yabo","origin"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","yabo-prod-frontend-proxy","yabo-frontend-proxy","yabo-prod-frontend-proxy-nginx-config"
    // ,"yaboxxx-web","10.17.0.181","yabo","origin"),

    // # istio-yabo
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","yabo-frontend-proxy-qa","","yabo-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.142","yabo","istio"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","yabo-frontend-proxy-beta","","yabo-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.0.128","yabo","istio"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","yabo-frontend-proxy-demo","","yabo-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.0.181","yabo","istio"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","yabo-prod-frontend-proxy","","yabo-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.0.181","yabo","istio"),

    // # yiyuan
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","cxbb-frontend-proxy-qa","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.142","yiyuan","origin"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","cxbb-frontend-proxy-beta","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.0.128","yiyuan","origin"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","cxbb-frontend-proxy-demo","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.0.181","yiyuan","origin"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","cxbb-frontend-proxy-prod","nginx-ssl-qa","cxbb-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.0.181","yiyuan","origin"),
    
    // # istio-yiyuan
    // Pipeline("QA","yaboxxx-test","asia-east1-b"
    // ,"qa","yiyuan-frontend-proxy-qa","nginx-ssl-qa","yiyuan-frontend-proxy-nginx-config-qa"
    // ,"yaboxxx-web","10.27.1.142","yiyuan","istio"),
    // Pipeline("Beta","yaboxxx-prod","asia-east1-b"
    // ,"beta","yiyuan-frontend-proxy-beta","nginx-ssl-qa","yiyuan-frontend-proxy-nginx-config-beta"
    // ,"yaboxxx-web","10.17.0.128","yiyuan","istio"),
    // Pipeline("Demo","yaboxxx-prod","asia-east1-b"
    // ,"demo","yiyuan-frontend-proxy-demo","nginx-ssl-qa","yiyuan-frontend-proxy-nginx-config-demo"
    // ,"yaboxxx-web","10.17.0.181","yiyuan","istio"),
    // Pipeline("Prod","yaboxxx-prod","asia-east1-b"
    // ,"prod","yiyuan-frontend-proxy-prod","nginx-ssl-qa","yiyuan-frontend-proxy-nginx-config-prod"
    // ,"yaboxxx-web","10.17.0.181","yiyuan","istio"),

]
