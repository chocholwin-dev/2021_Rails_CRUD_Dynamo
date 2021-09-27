class Api::V1::WritingPolicyTemplateController < ApplicationController
  skip_before_action :verify_authenticity_token
  # dynamodb接続設定の宣言
    # 作成日：2021/09/08
    $dynamo_db = Aws::DynamoDB::Client.new(
      region: "ap-northeast-1",
      access_key_id: "1234567890",
      secret_access_key: "0987654321",
      endpoint: "http://dynamodb-local:8000"
    )

    # 初期表示
    # @url GET /api/v1/writing_policy_template/index
    # @return jsonタイプの「執筆方針テンプレートリスト」返却
    def index
      # 執筆方針テンプレートデータ取得（テーブル表示のため）
    
      response = $dynamo_db.scan(
        table_name: 'WritingPolicyTemplate_TB',
        filter_expression: 'delete_flag = :deleteFlag',
        expression_attribute_values: {
        ':deleteFlag' => 0
        },
        select: 'ALL_ATTRIBUTES')
  
      item = response.items

      puts item
    
      @templates = item
      render json: @templates
    end

    # 執筆方針テンプレート保存処理 
    # @url POST /status/create 
    # 引数： templateSK、status、status_color
    def create
  
      # 表示順
      item_templateSK = params[:display_order]
      item_display_order = params[:display_order]
  
      # 骨子ステータス
      item_template_type = params[:template_type]
  
      # 骨子ステータス色
      item_template_name = params[:template_name]
      item_template_content = params[:template_content]
  
      # 登録された時
      create_datetime = Time.now
      create_date = create_datetime.to_s
      
      # 更新された時
      update_datetime = Time.now
      update_date = update_datetime.to_s
      
      # データ登録処理
      $dynamo_db.put_item({
          table_name: 'WritingPolicyTemplate_TB',
          item: {
          'templatePK' => 'templates',
          'templateSK' => 'template_order_'+item_templateSK,
          'delete_flag' => 0,
          'display_order'=> item_display_order,
          'template_type'=> item_template_type,
          'template_name' => item_template_name,
          'template_content' => item_template_content,
          'created_at' => create_date,
          'updated_at' => update_date
          }
      })
      render json: { notice: '登録処理が成功しました。'}
    end

    # 骨子ステータス更新処理
    # @url DELETE /status/1
    # 引数： kosshiPK、kosshiSK
    def destroy      
      
      #　削除対象とするpartitionkeyとsortkeyの取得
       templatePK_del = params[:templatePK]
       templateSK_del = params[:templateSK]
  
      # 削除処理
       response = $dynamo_db.delete_item({
                  table_name: 'WritingPolicyTemplate_TB',
                  key: {
                    'templatePK' => templatePK_del,
                    'templateSK' => templateSK_del
                  }
                })
      render json: { notice: '削除処理が成功しました。' }
  
    end

    # 骨子ステータス更新処理
    # @url PUT /status/update/
    # 引数： kosshiSK、status、status_color
    def update
  
      #更新するデータ取得
      upd_templateSK = params[:templateSK]
      upd_display_order = params[:display_order]
      upd_template_type = params[:template_type]
      upd_template_name = params[:template_name]
      upd_template_content = params[:template_content]
  
      # 更新された時
      update_datetime = Time.now
      update_date = update_datetime.to_s
      puts "Update Time " + String(update_date)
  
      # kosshiSKを利用している全行を取得
      response = $dynamo_db.query({
        table_name: 'WritingPolicyTemplate_TB',
        index_name: 'TemplateSKIndex',
        select: 'ALL_PROJECTED_ATTRIBUTES',
        key_condition_expression: 'templateSK = :templateSK',
        expression_attribute_values: {
        ':templateSK' => upd_templateSK
        }
      })      
      items = response.items
  
      # 取得された行数で更新する
      for i in 0..items.count-1
  
        # 取得した行のkosshiPK(partitionkey)
        search_pk = items[i]['templatePK']
  
        # 取得した行のtemplateSK(sortkey)
        search_sk = items[i]['templateSK']
  
        #更新処理
        updateStatement = "UPDATE WritingPolicyTemplate_TB SET display_order = '"+ upd_display_order + "' SET template_type = '" + upd_template_type + "' SET template_name = '" + template_name + "' SET template_content = '" + template_content + "' SET updated_at = '" + update_date + "' WHERE templatePK = '"+ search_pk +"' and templateSK = '" + search_sk + "'"
        response = $dynamo_db.batch_execute_statement({
          statements: [ 
          {
              statement: updateStatement,
              parameters: ["String"], 
              consistent_read: false,
          },
          ],
        })
      end
      render json: { notice: '更新処理が成功しました。'}
    end
end
