# 骨子ステータス管理画面
# 作成日：2021/09/08

class Api::V1::StatusController < ApplicationController
  
    # dynamodb接続設定の宣言
    # 作成日：2021/09/08
    $dynamo_db = Aws::DynamoDB::Client.new(
      region: "ap-northeast-1",
      access_key_id: "1234567890",
      secret_access_key: "0987654321",
      endpoint: "http://dynamodb-local:8000"
    )
  
    # 初期表示
    # @url GET /status/index 
    # @return jsonタイプの「ステータスリスト」返却
    def index
      # ステータスデータ取得（テーブル表示のため）
    
      response = $dynamo_db.scan(
        table_name: 'KOSSHI_TB',
        filter_expression: 'delete_flag = :deleteFlag',
        expression_attribute_values: {
        ':deleteFlag' => 0
        },
        select: 'ALL_ATTRIBUTES')
  
      item = response.items
    
      @statuses = item
      render json: @statuses
    end
  
    # 骨子ステータス保存処理 
    # @url POST /status/create 
    # 引数： kosshiSK、status、status_color
    def create
  
      # 表示順
      item_kosshiSK = params[:display_order]
      item_display_order = params[:display_order]
  
      # 骨子ステータス
      item_status = params[:status]
  
      # 骨子ステータス色
      item_status_color = params[:status_color]
  
      # 登録された時
      create_datetime = Time.now
      create_date = create_datetime.to_s
      
      # 更新された時
      update_datetime = Time.now
      update_date = update_datetime.to_s
      
      # データ登録処理
      $dynamo_db.put_item({
          table_name: 'KOSSHI_TB',
          item: {
          'kosshiPK' => 'statuses',
          'kosshiSK' => 'status_order_'+item_kosshiSK,
          'tableNm' => 'statuses',
          'delete_flag' => 0,
          'display_order'=> item_display_order,
          'status'=> item_status,
          'status_color' => item_status_color,
          'created_at' => create_date,
          'updated_at' => update_date
          }
      })
      render json: { notice: '登録処理が成功しました。'}
    end
  
    # 骨子ステータス更新処理
    # @url PUT /status/update/
    # 引数： kosshiSK、status、status_color
    def update
  
      #更新するデータ取得
      upd_kosshiSK = params[:kosshiSK]
      upd_display_order = params[:display_order]
      upd_color = params[:status_color]
      upd_status = params[:status]
  
      # 更新された時
      update_datetime = Time.now
      update_date = update_datetime.to_s
      puts "Update Time " + String(update_date)
  
      # kosshiSKを利用している全行を取得
      response = $dynamo_db.query({
        table_name: 'KOSSHI_TB',
        index_name: 'KosshiSKIndex',
        select: 'ALL_PROJECTED_ATTRIBUTES',
        key_condition_expression: 'kosshiSK = :kosshiSK',
        expression_attribute_values: {
        ':kosshiSK' => upd_kosshiSK
        }
      })      
      items = response.items
  
      # 取得された行数で更新する
      for i in 0..items.count-1
  
        # 取得した行のkosshiPK(partitionkey)
        search_pk = items[i]['kosshiPK']
  
        # 取得した行のkosshiSK(sortkey)
        search_sk = items[i]['kosshiSK']
  
        #更新処理
        updateStatement = "UPDATE KOSSHI_TB SET display_order = '"+ upd_display_order + "' SET status_color = '" + upd_color + "' SET status = '" + upd_status + "' SET updated_at = '" + update_date + "' WHERE kosshiPK = '"+ search_pk +"' and kosshiSK = '" + search_sk + "'"
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
  
    # 骨子ステータス更新処理
    # @url DELETE /status/1
    # 引数： kosshiPK、kosshiSK
    def destroy      
      
      #　削除対象とするpartitionkeyとsortkeyの取得
       kosshiPK_del = params[:kosshiPK]
       kosshiSK_del = params[:kosshiSK]
  
      # 削除処理
       response = $dynamo_db.delete_item({
                  table_name: 'KOSSHI_TB',
                  key: {
                    'kosshiPK' => kosshiPK_del,
                    'kosshiSK' => kosshiSK_del
                  }
                })
      render json: { notice: '削除処理が成功しました。' }
  
    end
  
    private
      def status_params
        params.permit(:kosshiSK, :status, :status_color)
      end
  end
  
  